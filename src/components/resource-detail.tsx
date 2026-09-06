import Link from "next/link";
import { subjectInterests } from "@/content/subjects";
import type { CatalogRecord } from "@/lib/catalog-types";
import { formatBytes } from "@/lib/catalog-types";
import { SaveButton } from "./catalog-browser";
export function ResourceDetail({
  record,
  review = false,
}: {
  record: CatalogRecord;
  review?: boolean;
}) {
  const subject = subjectInterests.find((item) => item.id === record.subject);
  return (
    <div className="site-container detail-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href={review ? "/review" : "/library"}>
          {review ? "Local review" : "Library"}
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/subjects/${record.subject}`}>{subject?.title}</Link>
      </nav>
      <p className="eyebrow">
        {record.kind} · {record.format}
      </p>
      <h1>{record.title}</h1>
      <p className="interior-lede">{record.summary}</p>
      <dl className="resource-facts">
        <div>
          <dt>Subject</dt>
          <dd>{subject?.title}</dd>
        </div>
        <div>
          <dt>Format</dt>
          <dd>{record.format}</dd>
        </div>
        <div>
          <dt>File size</dt>
          <dd>{formatBytes(record.bytes)}</dd>
        </div>
        <div>
          <dt>Source updated</dt>
          <dd>
            <time dateTime={record.updatedAt}>{record.updatedAt}</time>
          </dd>
        </div>
      </dl>
      <div className="action-row">
        {!review && record.downloadUrl ? (
          <a
            className="button button-primary"
            href={record.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open {record.format}{" "}
            <span className="visually-hidden">in a new tab</span>
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <p className="availability-message">
            {review
              ? "This resource is available for local catalog review. Downloads have not been released."
              : "The download for this resource is being prepared."}
          </p>
        )}
        {!review ? <SaveButton id={record.id} title={record.title} /> : null}
      </div>
      <section className="detail-note">
        <h2>{review ? "Review the source edition" : "Using this resource"}</h2>
        <p>
          {review
            ? "This record comes from the curated September 2, 2026 snapshot. Confirm the edition before releasing it; later Dropbox revisions are not automatically substituted."
            : "Check the file format and update date before opening. Save this resource to keep it in your reading list for a later session."}
        </p>
      </section>
    </div>
  );
}
