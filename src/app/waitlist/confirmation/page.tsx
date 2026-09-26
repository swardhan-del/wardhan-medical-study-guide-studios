import { searchMetadata } from "@/lib/search-metadata";
import Link from "next/link";
export const metadata = searchMetadata("/waitlist/confirmation");
export default function ConfirmationPage() {
  return <div className="site-container study-page"><header className="study-hero"><h1>Continue your study session</h1><p>If you arrived from a valid confirmation link, Brevo, our email service, manages the confirmation. This page cannot verify your subscription status; opening it directly does not join the waitlist.</p><p>You can withdraw from updates through the unsubscribe link in an update or the <Link href="/privacy#waitlist">privacy contact</Link>.</p><Link className="button button-primary" href="/library">Return to the free library</Link></header></div>;
}
