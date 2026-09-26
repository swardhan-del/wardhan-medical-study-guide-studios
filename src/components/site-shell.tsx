import { ReadingListProvider } from "./reading-list-provider";
import type { ReactNode } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { studio } from "@/content/studio";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ReadingListProvider>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteNav />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <footer className="site-footer">
        <div className="site-container footer-inner">
          <div>
            <p className="footer-title">Wardhan Medical Study Guide Studios</p>
            <p className="footer-note">
              Focused resources for learning medical sciences.
            </p>
            <p className="footer-note clinical-review-notice">
              Independent clinical peer review has not been completed for this
              teaching content. Educational study support, not medical advice
              or a substitute for official course material.{" "}
              <Link href="/about#clinical-review">Read the review status</Link>.
            </p>
          </div>
          <div className="footer-meta">
            <span>An independent educational project by {studio.founderName}.</span>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms and disclaimer</Link>
            <Link href="/starter-pack">Free starter pack</Link>
            <Link href="/study#saved-learning">My Study</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
      </footer>
    </ReadingListProvider>
  );
}
