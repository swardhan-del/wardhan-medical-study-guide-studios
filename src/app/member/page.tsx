import Link from "next/link";
import { getMemberState } from "@/server/membership";
import { pilotModules } from "@/lib/membership/catalog";
import { accessMessages, moduleAccess } from "@/lib/membership/access";
export default async function MemberDashboard() {
  const state = await getMemberState();
  return <>
    <header><p className="eyebrow">Member area · preparation preview</p><h1>Your learning dashboard</h1>
      <p>Membership enrolment is not open. The modules below contain synthetic access checks only.</p></header>
    <section className="membership-panel"><h2>Membership status</h2>
      <p>{state.kind === "verified" ? `${state.member.tier === "basic" ? "Basic" : "Advanced"} · ${state.member.status}` : state.kind === "anonymous" ? accessMessages["sign-in"] : accessMessages.unavailable}</p>
      <Link href="/account" prefetch={false}>Review account</Link>
    </section>
    <section id="modules"><h2>My modules</h2><p>Work through each included module in its intended order. Access is checked when you open it.</p>
      <div className="membership-grid">{pilotModules.map(module => {
        const access = moduleAccess(state, module.id);
        return <article className="membership-panel" key={module.id}><h3>{module.title}</h3>
          <p>{access.allowed ? "Available with your verified membership." : accessMessages[access.reason]}</p>
          <Link href={`/member/modules/${module.id}`} prefetch={false}>{access.allowed ? "Open module" : "View access requirements"}</Link>
        </article>;
      })}</div>
    </section>
    <section className="membership-panel"><h2>Continue learning</h2><p>Choose an available module above. Account-based progress is not connected yet.</p></section>
    <section id="downloads" className="membership-panel"><h2>Downloads and tools</h2><p>Downloads appear inside included modules. Each request requires a current membership check. No teaching downloads or additional tools are included in this preparation preview.</p></section>
  </>;
}
