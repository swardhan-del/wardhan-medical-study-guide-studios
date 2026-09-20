export function pilotConfig(env: NodeJS.ProcessEnv) {
  if (env.MEMBERSHIP_PILOT_ENABLED !== "1" || env.VERCEL_ENV === "production" || (env.VERCEL && env.VERCEL_ENV !== "preview")) return null;
  try {
    const url = new URL(env.NEXT_PUBLIC_SUPABASE_URL ?? "");
    const origin = new URL(env.MEMBERSHIP_PILOT_ORIGIN ?? "");
    const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (url.protocol !== "https:" || !/^[a-z0-9]+\.supabase\.co$/.test(url.hostname) || url.username || url.password ||
        url.search || url.hash || url.pathname !== "/" || url.port) return null;
    const local = !env.VERCEL && ["localhost", "127.0.0.1"].includes(origin.hostname);
    if ((!local && (origin.protocol !== "https:" || !origin.hostname.endsWith(".vercel.app"))) || origin.username ||
        origin.password || origin.search || origin.hash || origin.pathname !== "/" || (!local && origin.port) || !key) return null;
    const emails = (env.MEMBERSHIP_PILOT_EMAIL_ALLOWLIST ?? "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
    if (emails.length < 2 || emails.length > 3 || new Set(emails).size !== emails.length || emails.some(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return null;
    return { url: url.origin, key, origin: origin.origin, emails, secure: !local };
  } catch { return null; }
}
