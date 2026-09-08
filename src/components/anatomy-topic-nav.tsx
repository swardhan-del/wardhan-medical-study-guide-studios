import Link from "next/link";
import { anatomyTopicLinks, anatomyTopicHref } from "@/content/anatomy-navigation";

export function AnatomyTopicNav({ current }: { current?: string }) {
  return (
    <nav aria-label="Anatomy subject areas">
      <ul className="topic-list anatomy-topic-nav">
        {anatomyTopicLinks.map((topic) => (
          <li key={topic.slug}>
            <Link href={anatomyTopicHref(topic.slug)} aria-current={current === topic.slug ? "page" : undefined}>
              {topic.label} <span aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
