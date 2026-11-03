const privateMarker = /dropbox(?:usercontent)?\.com|(?:[\\/]Users[\\/]|[\\/]home[\\/])|file:\/\/|[\\/]study guide[\\/]|\.private[\\/]|Library[\\/]CloudStorage|(?:rlkey|access_token|token)=/i;
const text = (v, label) => {
  if (typeof v !== 'string' || !v.trim() || v.length > 10000 || privateMarker.test(v)) throw new Error(`Invalid ${label}`);
  return v.trim();
};
const list = (v, label, max) => {
  if (!Array.isArray(v) || v.length < 1 || v.length > max) throw new Error(`Invalid ${label}`);
  return v;
};
/** Copy only fields the local reviewer needs; never import source paths or provenance. */
export function normalizeCandidates(documents) {
  const out = [], ids = new Set();
  for (const document of documents) {
    if (!document || typeof document !== 'object' || Array.isArray(document)) throw new Error('Invalid input');
    const entries = Array.isArray(document.lessons) ? document.lessons : [document];
    if (entries.length > 100) throw new Error('Too many lessons');
    for (const entry of entries) {
      if ((entry.releaseStatus ?? document.releaseStatus) !== 'review-required') throw new Error('Only review-required candidates are accepted');
      const id = text(entry.id, 'id');
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || ids.has(id)) throw new Error('Invalid or duplicate candidate id');
      ids.add(id);
      const sections = list(entry.sections, 'sections', 30).map(s => ({ heading: text(s?.heading, 'heading'), body: text(s?.body, 'body') }));
      const q = entry.question;
      const options = list(q?.options, 'options', 10).map(o => ({ text: text(o?.text, 'option'), explanation: text(o?.explanation, 'explanation') }));
      if (options.length < 2 || !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= options.length) throw new Error('Invalid answer index');
      const references = list(entry.references, 'references', 20).map(r => {
        const title = text(r?.title, 'reference title'), raw = text(r?.url, 'reference URL');
        let url; try { url = new URL(raw); } catch { throw new Error('Invalid reference URL'); }
        if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) throw new Error('Unsafe reference URL');
        return { title, url: url.href };
      });
      out.push({ id, title: text(entry.title, 'title'), subject: text(entry.subject, 'subject'), objectives: list(entry.objectives, 'objectives', 20).map(o => text(o, 'objective')), sections, question: { prompt: text(q.prompt, 'question'), options, answer: q.answer }, references });
    }
  }
  if (!out.length || out.length > 100) throw new Error('Invalid candidate count');
  return { version: 1, candidates: out };
}
