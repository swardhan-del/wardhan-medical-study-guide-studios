export type Attempt = {
  attempts: number;
  correct: number;
  lastCorrect: boolean;
  streak: number;
  dueAt: number;
  firstCorrect: boolean | null;
  lastAt: number;
  lastChoice: number | null;
  assisted: boolean;
};
export type LearningProgress = {
  version: 2;
  lessons: string[];
  answers: Record<string, Attempt>;
  drafts: Record<string, string>;
  visits: string[];
  quizzes: number;
  shares: number;
  oral: string[];
  plan: { start: string; date: string; minutes: number } | null;
};
export const emptyProgress = (): LearningProgress => ({
  version: 2,
  lessons: [],
  answers: {},
  drafts: {},
  visits: [],
  quizzes: 0,
  shares: 0,
  oral: [],
  plan: null,
});
const finiteInt = (value: unknown, max = 1000000) =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= 0 &&
  value <= max;
export function parseProgress(
  raw: string | null,
  lessons: string[],
  questions: string[],
  draftIds: string[] = [],
): LearningProgress {
  const clean = emptyProgress();
  if (!raw || raw.length > 1000000) return clean;
  try {
    const value = JSON.parse(raw);
    if (!value || ![1, 2].includes(value.version)) return clean;
    for (const key of ["lessons", "oral"] as const) {
      if (Array.isArray(value[key]))
        clean[key] = [
          ...new Set<string>(
            value[key].filter(
              (id: unknown) => typeof id === "string" && lessons.includes(id),
            ),
          ),
        ];
    }
    if (Array.isArray(value.visits))
      clean.visits = [
        ...new Set<string>(
          value.visits.filter(
            (d: unknown) => typeof d === "string" && validDate(d),
          ),
        ),
      ]
        .sort()
        .slice(-366);
    if (finiteInt(value.quizzes)) clean.quizzes = value.quizzes;
    if (finiteInt(value.shares)) clean.shares = value.shares;
    if (
      value.plan &&
      validDate(value.plan.start) &&
      validDate(value.plan.date) &&
      Number.isInteger(value.plan.minutes) &&
      value.plan.minutes >= 10 &&
      value.plan.minutes <= 120
    )
      clean.plan = value.plan;
    for (const id of draftIds) {
      if (typeof value.drafts?.[id] === "string" && value.drafts[id].length <= 5000) clean.drafts[id] = value.drafts[id];
    }
    for (const id of questions) {
      const a = value.answers?.[id];
      if (
        a &&
        finiteInt(a.attempts) &&
        a.attempts > 0 &&
        finiteInt(a.correct) &&
        a.correct <= a.attempts &&
        typeof a.lastCorrect === "boolean" &&
        finiteInt(a.streak, 10000) &&
        finiteInt(a.dueAt, 8640000000000000)
      ) {
        clean.answers[id] = {
          attempts: a.attempts,
          correct: a.correct,
          lastCorrect: a.lastCorrect,
          streak: a.streak,
          dueAt: a.dueAt,
          firstCorrect: typeof a.firstCorrect === "boolean" ? a.firstCorrect : (a.attempts === 1 ? a.lastCorrect : null),
          lastAt: finiteInt(a.lastAt, 8640000000000000) ? a.lastAt : 0,
          lastChoice: finiteInt(a.lastChoice, 100) ? a.lastChoice : null,
          assisted: a.assisted === true,
        };
      }
    }
  } catch {
    /* Invalid browser data starts a fresh, usable learning session. */
  }
  return clean;
}
export function gradeAttempt(
  previous: Attempt | undefined,
  correct: boolean,
  now: number,
  choice: number | null = null,
  usedHint = false,
): Attempt {
  // A repeat inside 24 hours may use recently revealed feedback. It never
  // advances a spaced-review streak or delays an already-due correction.
  const assisted = usedHint || !!(previous?.lastAt && (now - previous.lastAt < 86400000 || now < previous.dueAt));
  const streak = !correct ? 0 : assisted ? (previous?.streak ?? 0) : Math.min((previous?.streak ?? 0) + 1, 10000);
  const days = [1, 3, 7, 14, 30][Math.min(Math.max(streak - 1, 0), 4)];
  return {
    attempts: Math.min((previous?.attempts ?? 0) + 1, 1000000),
    correct: Math.min((previous?.correct ?? 0) + Number(correct), 1000000),
    lastCorrect: correct,
    firstCorrect: previous ? previous.firstCorrect : correct,
    lastAt: now,
    lastChoice: choice,
    assisted,
    streak,
    dueAt: !correct ? now : assisted ? (previous?.dueAt ?? now) : now + days * 86400000,
  };
}
export function practiceSummary(ids: string[], answers: Record<string, Attempt>) {
  const attempted = ids.filter((id) => answers[id]);
  return {
    total: ids.length,
    attempted: attempted.length,
    latestCorrect: attempted.filter((id) => answers[id].lastCorrect).length,
    firstCorrect: attempted.filter((id) => answers[id].firstCorrect === true).length,
    firstKnown: attempted.filter((id) => answers[id].firstCorrect !== null).length,
    correctedWithHelp: attempted.filter((id) => answers[id].lastCorrect && answers[id].assisted).length,
  };
}
export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}
export function calendarDays(start: string, end: string): number {
  if (!validDate(start) || !validDate(end)) return NaN;
  return Math.round(
    (Date.parse(`${end}T12:00:00Z`) - Date.parse(`${start}T12:00:00Z`)) /
      86400000,
  );
}
export function studyPlan(
  start: string,
  exam: string,
  minutes: number,
  topics: { slug: string; minutes: number }[],
) {
  const days = calendarDays(start, exam);
  if (
    !Number.isFinite(days) ||
    days < 1 ||
    days > 366 ||
    !Number.isInteger(minutes) ||
    minutes < 10 ||
    minutes > 120
  )
    return null;
  const tasks = topics.flatMap((t) => [
    { slug: t.slug, kind: "Learn + quiz", minutes: t.minutes + 5 },
    { slug: t.slug, kind: "Recall without notes", minutes: 5 },
  ]);
  // Cover new topics first; use later days for spaced recall and mixed practice.
  const queue = [
    ...tasks.filter((t) => t.kind === "Learn + quiz"),
    ...tasks.filter((t) => t.kind !== "Learn + quiz"),
  ];
  const sessions: {
    date: string;
    tasks: { slug: string; kind: string; minutes: number }[];
  }[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(`${start}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + i);
    let remaining = minutes;
    const assigned: typeof queue = [];
    while (queue.length && remaining > 0) {
      const task = queue[0];
      const allocated = Math.min(task.minutes, remaining);
      assigned.push({ ...task, minutes: allocated });
      remaining -= allocated;
      task.minutes -= allocated;
      if (!task.minutes) queue.shift();
      else break;
    }
    if (!assigned.length)
      assigned.push({
        slug: "",
        kind: "Due questions + weakest topic + oral recall",
        minutes,
      });
    sessions.push({ date: date.toISOString().slice(0, 10), tasks: assigned });
  }
  return {
    sessions,
    unfinishedMinutes: queue.reduce((n, task) => n + task.minutes, 0),
  };
}
export function renalCircuit(afferent: number, efferent: number) {
  if (
    ![afferent, efferent].every((x) => Number.isFinite(x) && x >= 0.5 && x <= 2)
  )
    throw new Error("Resistance outside teaching-model range");
  // Fixed arterial pressure 100 and venous pressure 0, arbitrary normalized units.
  const flow = 2 / (afferent + efferent);
  const pressure = (100 * efferent) / (afferent + efferent);
  return {
    flowPercent: Math.round(flow * 100),
    pressure: Math.round(pressure),
  };
}
export function ventilationModel(relativeVentilation: number) {
  if (
    !Number.isFinite(relativeVentilation) ||
    relativeVentilation < 0.5 ||
    relativeVentilation > 2
  )
    throw new Error("Ventilation outside teaching-model range");
  const co2 = 40 / relativeVentilation;
  return { co2, ph: 6.1 + Math.log10(24 / (0.03 * co2)) };
}
export function wintersRange(bicarbonate: number) {
  const center = 1.5 * bicarbonate + 8;
  return { low: center - 2, high: center + 2 };
}
