import Link from "next/link";
import { accessDecision } from "@/lib/membership-core";
import { getMemberSession } from "@/lib/member-session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = {
  title: "Member area",
  robots: { index: false, follow: false },
};

export default async function MemberPage() {
  const session = await getMemberSession();
  const decision = accessDecision({ session, requiredTier: "basic" });

  return (
    <div className="page-stack page-interior">
      <section className="interior-hero site-container" aria-labelledby="member-heading">
        <p className="eyebrow">Member area</p>
        <h1 id="member-heading">{decision.allowed ? "Membership recognised." : "Sign-in is not configured yet."}</h1>
        {decision.allowed && session ? (
          <>
            <p className="interior-lede">Your current level: <strong>{session.tier === "advanced" ? "Advanced" : "Basic"}</strong>.</p>
            <p>Released modules, saved work, renewals, and account controls will appear here after the account and billing services are connected.</p>
          </>
        ) : (
          <p className="interior-lede">Member access remains closed until the selected account provider can verify your membership. No protected learning material is available here yet.</p>
        )}
        <p><Link href="/membership">Explore the proposed memberships</Link></p>
      </section>
    </div>
  );
}
