import Link from "next/link";
export const dynamic = "force-dynamic";
export const metadata = { title: "Member area", robots: { index: false, follow: false } };
export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <div className="site-container page-interior membership-stack">
    <nav aria-label="Member navigation" className="membership-links">
      <Link href="/member" prefetch={false}>Dashboard</Link>
      <Link href="/member#modules" prefetch={false}>My modules</Link>
      <Link href="/member#downloads" prefetch={false}>Downloads and tools</Link>
      <Link href="/account" prefetch={false}>Account and membership</Link>
    </nav>
    {children}
  </div>;
}
