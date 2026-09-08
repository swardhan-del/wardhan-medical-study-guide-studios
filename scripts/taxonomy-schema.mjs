import assert from "node:assert/strict";
export function validateTaxonomy(data, catalog) {
  assert.equal(data.version, 1);
  assert(Array.isArray(data.subjects) && Array.isArray(data.nodes));
  const subjects = new Set(data.subjects.map((s) => s.id)),
    nodes = new Map(data.nodes.map((n) => [n.id, n]));
  assert.equal(subjects.size, data.subjects.length);
  assert.equal(nodes.size, data.nodes.length);
  const resources = new Set(
    catalog.records.filter((r) => r.status === "public").map((r) => r.id),
  );
  const covered = new Set();
  for (const s of data.subjects) {
    assert(/^[a-z0-9-]+$/.test(s.id));
    assert(s.title && s.description);
    assert(
      Object.keys(s).every((k) =>
        ["id", "title", "description", "learningSubject"].includes(k),
      ),
    );
  }
  for (const n of data.nodes) {
    assert(
      Object.keys(n).every((k) =>
        [
          "id",
          "title",
          "description",
          "subject",
          "parentId",
          "kind",
          "resources",
        ].includes(k),
      ),
    );
    assert(/^[a-z0-9-]+$/.test(n.id));
    assert(n.title && n.description && subjects.has(n.subject));
    assert(["system", "topic", "category"].includes(n.kind));
    assert(Array.isArray(n.resources));
    assert.equal(new Set(n.resources).size, n.resources.length);
    n.resources.forEach((id) => {
      assert(resources.has(id), "Unreleased resource in taxonomy: " + id);
      covered.add(id);
    });
    const visited = new Set([n.id]);
    let parent = n.parentId;
    while (parent) {
      const p = nodes.get(parent);
      assert(p && p.subject === n.subject, "Invalid parent");
      assert(!visited.has(parent), "Taxonomy cycle");
      visited.add(parent);
      parent = p.parentId;
    }
  }
  for (const id of resources)
    assert(covered.has(id), "Resource is not reachable from taxonomy: " + id);
  assert(
    !/dropbox|original_dropbox_path|destination_dropbox_path|[A-Z]:[\\/]|HOLD_RESTRICTED|CANDIDATE_FOR_PUBLIC_REVIEW/i.test(
      JSON.stringify(data),
    ),
    "Private metadata in taxonomy",
  );
  return data;
}
