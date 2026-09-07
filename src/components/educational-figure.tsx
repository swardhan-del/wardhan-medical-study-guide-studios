"use client";
/* eslint-disable @next/next/no-img-element -- Pre-generated, hash-approved srcsets avoid a second lossy conversion and preserve diagram labels. */
import { useEffect, useId, useRef, useState } from "react";
import type { PublicFigure } from "@/lib/figures";
const srcSet = (f: PublicFigure) =>
  f.variants
    .filter((v) => v.width <= 1280)
    .map((v) => `${v.src} ${v.width}w`)
    .join(", ");
export function FigureThumbnail({ figure }: { figure?: PublicFigure }) {
  return figure ? (
    <img
      className="figure-thumbnail"
      src={figure.variants[0].src}
      srcSet={srcSet(figure)}
      sizes="(max-width: 760px) 90vw, 360px"
      width={figure.width}
      height={figure.height}
      alt={figure.alt}
      loading="lazy"
      decoding="async"
    />
  ) : null;
}
export function EducationalFigure({ figure }: { figure: PublicFigure }) {
  const dialog = useRef<HTMLDialogElement>(null),
    id = useId();
  const [open, setOpen] = useState(false),
    [zoom, setZoom] = useState(1);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  function enlarge() {
    setZoom(1);
    setOpen(true);
    dialog.current?.showModal();
  }
  return (
    <figure className="educational-figure" id={"figure-" + figure.id}>
      <button
        className="figure-open"
        onClick={enlarge}
        aria-label={"Enlarge " + figure.title}
        aria-haspopup="dialog"
      >
        <img
          src={figure.variants[1]?.src || figure.src}
          srcSet={srcSet(figure)}
          sizes="(max-width: 760px) 90vw, 600px"
          width={figure.width}
          height={figure.height}
          alt={figure.alt}
          loading="lazy"
          decoding="async"
        />
        <span>Enlarge and zoom</span>
      </button>
      <figcaption>
        <strong>{figure.title}</strong>
        <p>{figure.caption}</p>
        <details>
          <summary>Figure source and usage</summary>
          <p>
            {figure.rights}. {figure.modifications}
          </p>
          <a href={figure.sourceUrl}>
            Source description or scientific reference
          </a>
        </details>
      </figcaption>
      <dialog
        className="figure-dialog"
        ref={dialog}
        aria-labelledby={id}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="figure-dialog-head">
          <h2 id={id}>{figure.title}</h2>
          <button
            className="button button-secondary"
            autoFocus
            onClick={() => dialog.current?.close()}
          >
            Close image
          </button>
        </div>
        {open && (
          <>
            <div className="figure-toolbar">
              <label>
                Image zoom{" "}
                <select
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                >
                  <option value={1}>Fit to screen</option>
                  <option value={1.5}>150%</option>
                  <option value={2}>200%</option>
                  <option value={3}>300%</option>
                </select>
              </label>
              <a href={figure.src} download>
                Download image
              </a>
              <a href={figure.src} target="_blank" rel="noopener noreferrer">
                Open image in a new tab
              </a>
            </div>
            <p className="muted-note">
              Scroll or swipe to move around the enlarged image. Press Escape to
              close.
            </p>
            <div
              className="figure-zoom-window"
              tabIndex={0}
              role="region"
              aria-label="Scrollable enlarged image"
            >
              <img
                src={figure.src}
                width={figure.width}
                height={figure.height}
                alt={figure.alt}
                style={{
                  width: `${zoom * 100}%`,
                  maxWidth: "none",
                  height: "auto",
                }}
              />
            </div>
            <p>{figure.caption}</p>
          </>
        )}
      </dialog>
    </figure>
  );
}
export function FigureGallery({
  figures,
  title = "Study figures",
  comparison = false,
}: {
  figures: PublicFigure[];
  title?: string;
  comparison?: boolean;
}) {
  if (!figures.length) return null;
  return (
    <section className="figure-gallery" aria-label={title}>
      <h2>{title}</h2>
      {comparison && (
        <p>
          Compare the number of cell layers and the shape of the surface cells.
          These sections have different source magnifications; compare
          architecture, not displayed cell size.
        </p>
      )}
      <div className={figures.length > 1 ? "figure-grid" : "figure-single"}>
        {figures.map((f) => (
          <EducationalFigure key={f.id} figure={f} />
        ))}
      </div>
    </section>
  );
}
