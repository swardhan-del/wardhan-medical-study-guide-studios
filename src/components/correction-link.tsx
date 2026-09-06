"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CorrectionLink() {
  const path = usePathname();
  return (
    <Link
      className="text-link"
      href={`/contact?lesson=${encodeURIComponent(path)}`}
    >
      Report a correction →
    </Link>
  );
}
