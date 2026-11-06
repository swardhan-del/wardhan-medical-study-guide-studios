"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CorrectionLink({ questionId }: { questionId?: string } = {}) {
  const path = usePathname();
  const query = questionId ? { question: questionId } : { lesson: path };
  return (
    <Link
      className="text-link"
      href={{ pathname: "/contact", query }}
      prefetch={questionId ? false : undefined}
    >
      {questionId ? "Report this question →" : "Report a correction →"}
    </Link>
  );
}
