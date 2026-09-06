"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/library", label: "Library" },
  { href: "/study", label: "My study" },
  { href: "/learn/renal", label: "Renal course" },
  { href: "/subjects", label: "Subjects" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <Link
          className="brand"
          href="/"
          aria-label="Wardhan Medical Study Guide Studios home"
        >
          <span className="brand-mark" aria-hidden="true">
            W
          </span>
          <span className="brand-copy">
            <span className="brand-name">Wardhan Medical</span>
            <span className="brand-subtitle">Study Guide Studios</span>
          </span>
        </Link>

        <nav aria-label="Primary navigation">
          <ul className="nav-list">
            <li>
              <Link
                className={`nav-link${pathname === "/" ? " is-active" : ""}`}
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
              >
                Home
              </Link>
            </li>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    className={`nav-link${isActive ? " is-active" : ""}`}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
