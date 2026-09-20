import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { decideSnapshot } from "../src/lib/membership-core.ts";

const bin = process.env.PG_BINDIR || spawnSync("pg_config", ["--bindir"], { encoding: "utf8" }).stdout?.trim();
if (!bin) throw new Error("Postgres is required; set PG_BINDIR to its bin directory");
const dir = mkdtempSync("/tmp/wmss-pilot-sql-");
function run(name, args, input) {
  const result = spawnSync(join(bin, name), args, { input, encoding: "utf8", timeout: 60000 });
  if (result.status !== 0) throw new Error(`${name}: ${result.stderr || result.stdout || result.error}`);
  return result.stdout.trim();
}
const sql = input => run("psql", ["-X", "-h", dir, "-U", "pilot_test_admin", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-At"], input);
let started = false, assertions = 0;
try {
  run("initdb", ["-D", join(dir, "data"), "-U", "pilot_test_admin", "-A", "trust", "--no-locale"]);
  run("pg_ctl", ["-D", join(dir, "data"), "-l", join(dir, "postgres.log"), "-o", `-k ${dir} -h ''`, "-w", "start"]);
  started = true;
  // Minimal local schemas stand in for hosted Supabase schemas ONLY for SQL/RLS testing.
  sql(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key);
    create table auth.sessions(id uuid primary key, user_id uuid references auth.users(id), not_after timestamptz);
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text);
    alter table storage.objects enable row level security;
    grant usage on schema public, storage to anon, authenticated, service_role;
    grant select, insert, update, delete on storage.objects to anon, authenticated, service_role;`);
  sql(readFileSync(new URL("../supabase/migrations/202609200001_preview_membership.sql", import.meta.url), "utf8"));
  const identity = { userId: "10000000-0000-4000-8000-000000000001", sessionId: "20000000-0000-4000-8000-000000000001" };
  sql(`insert into auth.users values ('${identity.userId}');
    insert into auth.sessions values ('${identity.sessionId}', '${identity.userId}', null);
    insert into public.memberships(user_id,tier,status,valid_until) values ('${identity.userId}','basic','active',now()+interval '1 day');
    insert into public.module_grants(membership_id,module_id) select id,'pilot-foundations' from public.memberships;
    insert into public.module_grants(membership_id,module_id) select id,'pilot-deep-dive' from public.memberships;`);
  const snapshot = (moduleId = "pilot-foundations") => JSON.parse(sql(`select public.pilot_access_snapshot('${identity.userId}','${identity.sessionId}', '${moduleId}');`));
  const expect = (status, moduleId = "pilot-foundations") => { assert.equal(decideSnapshot(snapshot(moduleId), identity, moduleId).status, status); assertions++; };
  expect(200); expect(403, "pilot-deep-dive");
  sql("update public.memberships set tier='advanced';"); expect(200); expect(200, "pilot-deep-dive");
  for (const status of ["expired", "revoked", "past_due", "cancelled"]) {
    sql(`update public.memberships set status='${status}';`); expect(403); expect(403, "pilot-deep-dive");
  }
  sql("update public.memberships set status='active',valid_until=now()-interval '1 second';"); expect(403);
  sql("update public.memberships set valid_until=now()+interval '1 day'; delete from public.module_grants where module_id='pilot-foundations';"); expect(403);
  sql("insert into public.module_grants(membership_id,module_id) select id,'pilot-foundations' from public.memberships;"); expect(200);
  sql("update auth.sessions set not_after=now()-interval '1 second';"); expect(401);
  sql("update auth.sessions set not_after=null;"); expect(200);
  sql("delete from auth.sessions;"); expect(401);
  sql(`insert into auth.sessions values ('${identity.sessionId}', '${identity.userId}', null); delete from public.memberships;`); expect(403);
  for (const role of ["anon", "authenticated"]) {
    for (const table of ["memberships", "module_grants", "module_catalog"]) {
      for (const action of ["SELECT", "INSERT", "UPDATE", "DELETE"]) {
        assert.equal(sql(`select has_table_privilege('${role}', 'public.${table}', '${action}');`), "f"); assertions++;
      }
      assert.equal(sql(`select relrowsecurity from pg_class where oid='public.${table}'::regclass;`), "t"); assertions++;
    }
    assert.equal(sql(`select has_function_privilege('${role}', 'public.pilot_access_snapshot(uuid,uuid,text)', 'EXECUTE');`), "f"); assertions++;
    // Actual SQL attempts as browser roles, not only an introspection of grants.
    assert.throws(() => sql(`set role ${role}; insert into public.module_catalog values ('pilot-foundations','basic',true);`), /permission denied/); assertions++;
    assert.throws(() => sql(`set role ${role}; select public.pilot_access_snapshot('${identity.userId}','${identity.sessionId}','pilot-foundations');`), /permission denied/); assertions++;
    assert.throws(() => sql(`set role ${role}; insert into storage.objects(bucket_id,name) values ('member-pilot-private','unauthorized');`), /row-level security/); assertions++;
  }
  assert.equal(sql("select public from storage.buckets where id='member-pilot-private';"), "f"); assertions++;
  sql("insert into storage.objects(bucket_id,name) values ('member-pilot-private','canary.txt');");
  assert.equal(sql("set role anon; select count(*) from storage.objects;"), "SET\n0"); assertions++;
  assert.equal(sql("set role authenticated; select count(*) from storage.objects;"), "SET\n0"); assertions++;
  assert.equal(sql("select has_function_privilege('service_role','public.pilot_access_snapshot(uuid,uuid,text)','EXECUTE');"), "t"); assertions++;
  console.log(`${assertions} SQL/RLS assertions passed against temporary Postgres. Hosted Supabase Auth/Storage were not exercised.`);
} finally {
  if (started) run("pg_ctl", ["-D", join(dir, "data"), "-m", "immediate", "-w", "stop"]);
  rmSync(dir, { recursive: true, force: true });
}
