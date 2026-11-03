import { mkdir, writeFile } from "node:fs/promises";
await mkdir(".private", { recursive: true });
try {
  await writeFile(
    ".private/catalog.json",
    JSON.stringify({
      version: 1,
      records: [
        {
          id: "test-anatomy",
          title: "Anatomy example",
          subject: "anatomy",
          kind: "test resource",
          format: "PDF",
          summary: "Synthetic test fixture, not a real study guide.",
          updatedAt: "2026-09-06",
          bytes: 1000,
          status: "private-review",
        },
        {
          id: "test-physiology",
          title: "Physiology example",
          subject: "physiology",
          kind: "test resource",
          format: "DOCX",
          summary: "Synthetic test fixture, not a real study guide.",
          updatedAt: "2026-09-05",
          bytes: 2000,
          status: "private-review",
        },
      ],
    }),
    { flag: "wx" },
  );
} catch (error) {
  if (error.code !== "EEXIST") throw error;
}
try {
  await writeFile('.private/candidate-lessons.json', JSON.stringify({ version: 1, candidates: [{ id: 'synthetic-candidate', title: 'Synthetic candidate', subject: 'physiology', objectives: ['Review the example'], sections: [{ heading: 'Example', body: 'Synthetic review text.' }], question: { prompt: 'Choose the example', answer: 0, options: [{ text: 'Yes', explanation: 'Correct.' }, { text: 'No', explanation: 'Try again.' }] }, references: [{ title: 'Example reference', url: 'https://example.org/a-very-long-path-that-needs-to-wrap-on-a-narrow-mobile-screen' }] }] }), { flag: 'wx' });
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
}
