import Link from "next/link";
import { getMemberState } from "@/server/membership";
import { accessMessages } from "@/lib/membership/access";
export const dynamic = "force-dynamic";
export const metadata = { title: "Account and membership", robots: { index: false, follow: false } };
export default async function AccountPage() {
  const state = await getMemberState();
  return <div className="site-container page-interior membership-stack"><h1>Account and membership</h1>
    <section className="membership-panel"><h2>{state.kind === "verified" ? "Your membership" : "Sign-in is not open yet"}</h2>
      <p>{state.kind === "verified" ? `${state.member.tier === "basic" ? "Basic" : "Advanced"} membership · ${state.member.status}.` : state.kind === "unavailable" ? accessMessages.unavailable : "We are preparing secure accounts. Membership enrolment and payments are not available yet."}</p>
      <p>Prices, billing terms and the final module list will be published before enrolment opens.</p>
      <form action="/api/account/sign-out" method="post"><button className="button button-secondary" type="submit">Clear this browser session</button></form>
    </section>
    <p><Link href="/member" prefetch={false}>Member dashboard</Link> · <Link href="/membership">Membership details</Link> · <Link href="/contact">Contact</Link></p>
  </div>;
}
