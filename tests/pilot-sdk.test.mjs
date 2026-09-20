import assert from "node:assert/strict";
import test from "node:test";
import { generateKeyPairSync, sign, randomUUID } from "node:crypto";
import { createServerClient } from "@supabase/ssr";
import { verifyPilotIdentity } from "../src/lib/pilot-identity.ts";

test("Supabase SDK contract: verified JWT still requires live Auth; logout removes cookies", async () => {
  // Ephemeral signing key + intercepted SDK fetch ONLY in this test process.
  // This does not authenticate against a real Supabase project or create an app login.
  const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const kid = randomUUID(), userId = randomUUID(), sessionId = randomUUID();
  const jwk = { ...publicKey.export({ format: "jwk" }), kid, alg: "ES256", use: "sig" };
  const encode = value => Buffer.from(JSON.stringify(value)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const payload = `${encode({ alg: "ES256", typ: "JWT", kid })}.${encode({ sub: userId, session_id: sessionId, aud: "authenticated", role: "authenticated", iss: "https://contractpilot.supabase.co/auth/v1", iat: now, exp: now + 3600 })}`;
  const token = `${payload}.${sign("sha256", Buffer.from(payload), { key: privateKey, dsaEncoding: "ieee-p1363" }).toString("base64url")}`;
  const user = { id: userId, aud: "authenticated", email: "sdk@example.invalid", email_confirmed_at: new Date().toISOString() };
  const jar = new Map([["sb-contractpilot-auth-token", `base64-${encode({ access_token: token, refresh_token: "test-process-only", expires_at: now + 3600, expires_in: 3600, token_type: "bearer", user })}`]]);
  let unavailable = false, liveCalls = 0, logoutCalls = 0;
  const client = createServerClient("https://contractpilot.supabase.co", "test-publishable-key", {
    cookieOptions: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
    cookies: {
      getAll: () => [...jar].map(([name, value]) => ({ name, value })),
      setAll: values => {
        for (const item of values) {
          assert.equal(item.options.httpOnly, true);
          assert.equal(item.options.secure, true);
          assert.equal(item.options.sameSite, "lax");
          if (item.value) jar.set(item.name, item.value); else jar.delete(item.name);
        }
      },
    },
    global: { fetch: async (input, init) => {
      const url = new URL(String(input));
      assert.equal(url.origin, "https://contractpilot.supabase.co");
      if (url.pathname.endsWith("/jwks.json")) return Response.json({ keys: [jwk] });
      if (url.pathname.endsWith("/user")) {
        liveCalls++;
        assert.equal(new Headers(init?.headers).get("authorization"), `Bearer ${token}`);
        return unavailable ? Response.json({ message: "Unavailable" }, { status: 503 }) : Response.json(user);
      }
      if (url.pathname.endsWith("/logout")) {
        logoutCalls++; assert.equal(url.searchParams.get("scope"), "local");
        return new Response(null, { status: 204 });
      }
      if (url.pathname.endsWith("/otp")) {
        const body = JSON.parse(init.body);
        assert.equal(body.create_user, false);
        assert.equal(body.code_challenge_method, "s256");
        assert.ok(body.code_challenge);
        assert.equal(url.searchParams.get("redirect_to"), "https://pilot-example.vercel.app/auth/callback");
        return Response.json({});
      }
      if (url.pathname.endsWith("/token")) {
        assert.equal(url.searchParams.get("grant_type"), "pkce");
        const body = JSON.parse(init.body);
        assert.equal(body.auth_code, "contract-code"); assert.ok(body.code_verifier);
        return Response.json({ access_token: token, refresh_token: "test-process-only", expires_in: 3600, token_type: "bearer", user });
      }
      assert.fail(`Unexpected SDK endpoint: ${url.pathname}`);
    } },
  });
  assert.deepEqual(await verifyPilotIdentity(client, [user.email]), { userId, sessionId });
  assert.equal(liveCalls, 1);
  unavailable = true;
  await assert.rejects(verifyPilotIdentity(client, [user.email]), /Identity unavailable/);
  assert.equal(liveCalls, 2, "cached signing key must not skip the fresh Auth request");
  unavailable = false;
  const result = await client.auth.signOut({ scope: "local" });
  assert.equal(result.error, null); assert.equal(logoutCalls, 1); assert.equal(jar.size, 0);
  assert.equal(await verifyPilotIdentity(client, [user.email]), null);
  const otp = await client.auth.signInWithOtp({ email: user.email, options: { shouldCreateUser: false, emailRedirectTo: "https://pilot-example.vercel.app/auth/callback" } });
  assert.equal(otp.error, null);
  assert.ok([...jar.keys()].some(key => key.endsWith("-code-verifier")));
  const exchanged = await client.auth.exchangeCodeForSession("contract-code");
  assert.equal(exchanged.error, null);
  assert.deepEqual(await verifyPilotIdentity(client, [user.email]), { userId, sessionId });
  await client.auth.signOut({ scope: "local" });
  assert.equal(logoutCalls, 2); assert.equal(jar.size, 0);
  await client.auth.dispose();
});
