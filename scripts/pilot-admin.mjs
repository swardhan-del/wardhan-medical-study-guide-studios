// Local operator only; never imported by application routes. No credentials on CLI.
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { pilotConfig } from "../src/lib/pilot-config.ts";
const cfg = pilotConfig(process.env);
if (!cfg || !process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VERCEL ||
    process.env.PILOT_ADMIN_PROJECT_REF !== new URL(cfg.url).hostname.split(".")[0])
  throw new Error("Use local, preview-only credentials and explicitly confirm PILOT_ADMIN_PROJECT_REF");
const admin = createClient(cfg.url, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: AbortSignal.timeout(5000) }) },
});
const checked = result => { if (result.error) throw new Error("Pilot operation failed; inspect the authenticated console"); return result.data; };
const [command, email, tier, status = "active"] = process.argv.slice(2);
if (command === "canary") {
  const bucket = checked(await admin.storage.getBucket("member-pilot-private"));
  if (bucket.public) throw new Error("Bucket must be private");
  const objects = checked(await admin.storage.from(bucket.name).list("", { limit: 2 }));
  if (objects.length) throw new Error("Bucket is not empty; preserve the existing canary and inspect the console");
  // Bytes are generated only here and uploaded once. Never saved to Git/public/local fixtures.
  const body = `WMSS_PRIVATE_CANARY_${randomBytes(24).toString("hex")}\nSynthetic preview access check. Contains no teaching material.\n`;
  checked(await admin.storage.from(bucket.name).upload("canary.txt", body, { contentType: "text/plain", upsert: false }));
  console.log("One synthetic canary uploaded to the private preview bucket.");
} else if (command === "membership") {
  if (!cfg.emails.includes(email?.toLowerCase()) || !["basic", "advanced"].includes(tier) ||
      !["active", "expired", "revoked", "past_due", "cancelled"].includes(status)) throw new Error("Invalid allowlisted pilot assignment");
  const users = checked(await admin.auth.admin.listUsers({ page: 1, perPage: 10 })).users;
  // This separate pilot project must not contain unrelated accounts.
  if (users.length > 3 || users.some(user => !cfg.emails.includes(user.email?.toLowerCase()))) throw new Error("Project contains non-pilot users");
  const user = users.find(user => user.email?.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error("Pre-create the invited account in the authenticated console");
  // Revoke first so partial admin failures deny access rather than leave stale grants.
  checked(await admin.from("memberships").upsert({ user_id: user.id, tier, status: "revoked", valid_until: new Date().toISOString(), updated_at: new Date().toISOString() }, { onConflict: "user_id" }));
  const membership = checked(await admin.from("memberships").select("id").eq("user_id", user.id).single());
  checked(await admin.from("module_grants").delete().eq("membership_id", membership.id));
  const modules = tier === "advanced" ? ["pilot-foundations", "pilot-deep-dive"] : ["pilot-foundations"];
  checked(await admin.from("module_grants").insert(modules.map(module_id => ({ membership_id: membership.id, module_id }))));
  checked(await admin.from("memberships").update({ status, valid_until: new Date(Date.now() + (status === "expired" ? -60000 : 86400000)).toISOString(), updated_at: new Date().toISOString() }).eq("id", membership.id));
  console.log("Pilot membership and complete-module grants updated.");
} else throw new Error("Use canary, or membership <allowlisted email> <basic|advanced> [status]");
