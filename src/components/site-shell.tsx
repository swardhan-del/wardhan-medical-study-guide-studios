import { ReadingListProvider } from "./reading-list-provider";
import type { ReactNode } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ReadingListProvider>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteNav />
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="site-container footer-inner">
          <div>
            <p className="footer-title">Wardhan Medical Study Guide Studios</p>
            <p className="footer-note">
              Helping students learn medical sciences.
            </p>
          </div>
          <div className="footer-meta">
            <span>Created by Innovative.</span>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/study#saved-learning">Saved learning</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
      </footer>
    </ReadingListProvider>
  );
}
