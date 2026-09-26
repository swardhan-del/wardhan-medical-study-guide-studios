"use client";
import { useState } from "react";
import { recordStarterPackRequested } from "@/lib/learning-analytics";

/** A native no-JavaScript link, enhanced with success-only measurement. */
export function StarterPackDownload() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  return <div>
    <a className="button button-secondary" href="/starter-pack/download" download="wardhan-study-guide-starter-pack.html" aria-busy={busy} onClick={async event => {
      event.preventDefault();
      if (busy) return;
      setBusy(true); setMessage("");
      try {
        const response = await fetch("/starter-pack/download", { signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error("Unavailable");
        const url = URL.createObjectURL(await response.blob());
        const link = document.createElement("a");
        link.href = url; link.download = "wardhan-study-guide-starter-pack.html";
        document.body.append(link); link.click(); link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 60000);
        recordStarterPackRequested(true);
        setMessage("Starter pack received. Your browser handles the file download.");
      } catch {
        setMessage("The download could not be prepared. Try again or use Print / Save as PDF; the online pack remains available.");
      } finally { setBusy(false); }
    }}>Download starter pack (HTML)</a>
    <p role="status">{message}</p>
  </div>;
}
