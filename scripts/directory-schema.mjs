export function validateDirectory(data) {
  if (
    data.version !== 1 ||
    data.linkAccess !== "existing-dropbox-access" ||
    !Array.isArray(data.subjects) ||
    !Array.isArray(data.entries)
  )
    throw new Error("Invalid directory metadata");
  const subjectIds = new Set(data.subjects.map((s) => s.id));
  if (subjectIds.size !== data.subjects.length)
    throw new Error("Duplicate directory subject");
  const validUrl = (value) => {
    const u = new URL(value);
    if (
      u.protocol !== "https:" ||
      u.hostname !== "www.dropbox.com" ||
      u.username ||
      u.password ||
      u.port ||
      !/^\/(home|preview)\/study%20guide\//.test(u.pathname)
    )
      throw new Error("Invalid Dropbox directory URL");
    const p = decodeURIComponent(u.pathname);
    if (/\/(?:\.codex|\.private|00_Admin|99_Quarantine)|\/Users\//.test(p))
      throw new Error("Administrative path in directory");
  };
  for (const s of data.subjects) {
    if (!s.title || !s.description)
      throw new Error("Missing directory subject title");
    validUrl(s.dropboxUrl);
    if (s.printableUrl) validUrl(s.printableUrl);
  }
  const ids = new Set(),
    urls = new Set();
  for (const e of data.entries) {
    if (!e.id || ids.has(e.id) || urls.has(e.url))
      throw new Error("Duplicate directory entry");
    if (
      !e.title ||
      !e.subjects?.length ||
      e.subjects.some((s) => !subjectIds.has(s))
    )
      throw new Error("Unknown or missing directory subject");
    if (!["folder", "file"].includes(e.kind))
      throw new Error("Invalid directory kind");
    validUrl(e.url);
    ids.add(e.id);
    urls.add(e.url);
  }
  const byId = new Map(data.entries.map((e) => [e.id, e]));
  for (const e of data.entries) {
    let parent = e.parentId;
    const visited = new Set([e.id]);
    while (parent) {
      if (!ids.has(parent)) throw new Error("Missing directory parent");
      if (visited.has(parent)) throw new Error("Directory parent cycle");
      visited.add(parent);
      parent = byId.get(parent).parentId;
    }
  }
  return data;
}
