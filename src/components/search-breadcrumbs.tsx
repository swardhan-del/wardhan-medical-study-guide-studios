import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";
import { breadcrumbSchema, type Breadcrumb } from "@/lib/structured-data";
import { StructuredData } from "./structured-data";

export function SearchBreadcrumbs({ items }: { items: readonly Breadcrumb[] }) {
  return <>
    <StructuredData data={breadcrumbSchema(items, getSiteUrl())} />
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => <span key={item.href}>
        {i > 0 && <span aria-hidden="true"> / </span>}
        {i === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.href}>{item.name}</Link>}
      </span>)}
    </nav>
  </>;
}
