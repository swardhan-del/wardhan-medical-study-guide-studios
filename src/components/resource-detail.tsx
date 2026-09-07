import { FigureGallery } from "./educational-figure";
import { figuresForResource } from "@/lib/figures";
import { LessonVideos } from "./lesson-videos";
import Link from "next/link";
import type { CatalogRecord } from "@/lib/catalog-types";
import { formatBytes } from "@/lib/catalog-types";
import { publicCatalog } from "@/lib/catalog";
import { resourceNodes, recordsForNode, taxonomyNodes } from "@/lib/taxonomy";
import { ResourceBreadcrumbs } from "./taxonomy-navigation";
import { SaveButton } from "./catalog-browser";
export function ResourceDetail({
  record,
  review = false,
}: {
  record: CatalogRecord;
  review?: boolean;
}) {
  const file =
    record.format === "PDF"
      ? record.downloadUrl || record.href
      : record.downloadUrl;
  const node = resourceNodes(record.id)[0];
  const related = (
    node
      ? recordsForNode(
          taxonomyNodes.find((n) => n.id === node.parentId) || node,
        )
      : publicCatalog.filter((r) => r.subject === record.subject)
  )
    .filter((r) => r.id !== record.id)
    .slice(0, 4);
  return (
    <article className="site-container detail-page">
      {!review && <ResourceBreadcrumbs id={record.id} />}
      <p className="eyebrow">
        {record.kind} · {record.format}
      </p>
      <h1>{record.title}</h1>
      <p className="interior-lede">{record.summary}</p>
      <dl className="resource-facts">
        <div>
          <dt>Type</dt>
          <dd>{record.kind}</dd>
        </div>
        <div>
          <dt>Format</dt>
          <dd>{record.format}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>
            <time dateTime={record.updatedAt}>{record.updatedAt}</time>
          </dd>
        </div>
        {record.bytes > 0 && (
          <div>
            <dt>File size</dt>
            <dd>{formatBytes(record.bytes)}</dd>
          </div>
        )}
      </dl>
      {review ? (
        <p>Local catalog review only. Downloads have not been released.</p>
      ) : (
        <>
          <div className="action-row">
            {file ? (
              <>
                <a className="button button-primary" href={file} download>
                  Download {record.format}
                </a>
                <a
                  className="text-link"
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open full-size {record.format}
                  <span className="sr-only"> in a new tab</span>
                </a>
              </>
            ) : record.href ? (
              <Link className="button button-primary" href={record.href}>
                {record.format === "ACTIVITY"
                  ? "Start practice"
                  : "Read lesson"}{" "}
                →
              </Link>
            ) : (
              <p>No file is available for this resource.</p>
            )}
            <SaveButton id={record.id} title={record.title} />
          </div>
          <FigureGallery figures={figuresForResource(record.id)} />
          {file && record.format === "PDF" && (
            <section className="native-preview" aria-label="Document preview">
              <h2>Read the document</h2>
              <object
                data={file}
                type="application/pdf"
                aria-label={record.title + " PDF preview"}
              >
                <p>
                  Your browser cannot display this PDF inline.{" "}
                  <a href={file}>Open the PDF</a> or use the download button
                  above.
                </p>
              </object>
              <p>
                On a small screen, open the full-size document or download it
                for your reader.
              </p>
            </section>
          )}
          <LessonVideos lessonId={record.id} />
          <nav className="native-related" aria-label="Related resources">
            <h2>Continue studying</h2>
            <ul>
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={"/library/" + r.id}>{r.title}</Link>
                </li>
              ))}
            </ul>
            <Link
              href={node ? "/topics/" + node.id : "/subjects/" + record.subject}
            >
              Back to topic →
            </Link>
          </nav>
        </>
      )}
    </article>
  );
}
