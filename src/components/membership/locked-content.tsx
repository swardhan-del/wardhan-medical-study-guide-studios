import Link from "next/link";
import { accessMessages, type AccessDecision } from "@/lib/membership/access";
export function LockedContent({ access }: { access: Extract<AccessDecision, { allowed: false }> }) {
  return <section className="membership-panel" aria-labelledby="locked-heading">
    <h2 id="locked-heading">Content locked</h2>
    <p role="status">{accessMessages[access.reason]}</p>
    <p><Link href="/account" prefetch={false}>Account and membership</Link> · <Link href="/membership">Explore memberships</Link></p>
  </section>;
}
