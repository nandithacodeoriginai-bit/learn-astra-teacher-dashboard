// Prototype mock data for the LearnAstra teacher dashboard.
// A fixed "today" keeps server and browser renders identical.
export const TODAY = new Date("2026-11-18T09:00:00Z");
export const INACTIVE_AFTER_DAYS = 7;

export type Track = "CBSE" | "State" | "ICSE" | "KCET" | "NEET";

export type ClassInfo = {
  id: string;
  name: string;
  grade: "10th" | "PU II";
  track: Track;
  subject: string;
  students: number;
};

export type TestResult = {
  id: string;
  name: string;
  date: string;
  avg: number;
  passRate: number;
  distribution: { band: string; students: number }[];
};

export type WeakTopic = { topic: string; chapter: string; lossPct: number; affected: number };

export type Student = {
  id: string;
  name: string;
  score: number;
  accuracy: number;
  lastActive: string;
};

export function daysSince(iso: string, today: Date = TODAY): number {
  const ms = today.getTime() - new Date(iso).getTime();
  return Math.floor(ms / 86_400_000);
}

/** A student is flagged when they have had no activity for more than 7 days. */
export function isInactive(lastActive: string, today: Date = TODAY): boolean {
  return daysSince(lastActive, today) > INACTIVE_AFTER_DAYS;
}

export const classes: ClassInfo[] = [
  { id: "cbse-10a", name: "10 A", grade: "10th", track: "CBSE", subject: "Science", students: 42 },
  { id: "neet-b", name: "NEET Batch B", grade: "PU II", track: "NEET", subject: "Biology", students: 58 },
  { id: "kcet-1", name: "KCET Sprint", grade: "PU II", track: "KCET", subject: "Physics", students: 36 },
  { id: "state-10k", name: "10 Kannada Medium", grade: "10th", track: "State", subject: "Science", students: 31 },
];

const dist = (a: number[]) =>
  ["0–20", "21–40", "41–60", "61–80", "81–100"].map((band, i) => ({ band, students: a[i] ?? 0 }));

export const testsByClass: Record<string, TestResult[]> = {
  "cbse-10a": [
    { id: "t1", name: "Chemical Reactions — Ch. 1", date: "2026-11-12", avg: 68, passRate: 86, distribution: dist([2, 4, 9, 17, 10]) },
    { id: "t2", name: "Life Processes — Ch. 6", date: "2026-11-04", avg: 61, passRate: 78, distribution: dist([3, 6, 12, 14, 7]) },
    { id: "t3", name: "Half-yearly mock", date: "2026-10-22", avg: 64, passRate: 81, distribution: dist([2, 6, 11, 15, 8]) },
  ],
  "neet-b": [
    { id: "t4", name: "NEET Full Mock #6", date: "2026-11-15", avg: 54, passRate: 62, distribution: dist([6, 14, 18, 13, 7]) },
    { id: "t5", name: "Genetics drill", date: "2026-11-08", avg: 59, passRate: 70, distribution: dist([4, 11, 17, 18, 8]) },
  ],
  "kcet-1": [
    { id: "t6", name: "KCET Physics Mock #3", date: "2026-11-14", avg: 63, passRate: 75, distribution: dist([2, 7, 10, 11, 6]) },
    { id: "t7", name: "Electrostatics speed test", date: "2026-11-06", avg: 57, passRate: 66, distribution: dist([3, 9, 11, 9, 4]) },
  ],
  "state-10k": [
    { id: "t8", name: "Light — Reflection", date: "2026-11-13", avg: 71, passRate: 90, distribution: dist([1, 2, 7, 13, 8]) },
  ],
};

export const weakTopicsByClass: Record<string, WeakTopic[]> = {
  "cbse-10a": [
    { topic: "Balancing redox equations", chapter: "Chemical Reactions", lossPct: 46, affected: 24 },
    { topic: "Human excretory system", chapter: "Life Processes", lossPct: 39, affected: 19 },
    { topic: "Refraction through a lens", chapter: "Light", lossPct: 34, affected: 16 },
  ],
  "neet-b": [
    { topic: "Dihybrid cross ratios", chapter: "Principles of Inheritance", lossPct: 52, affected: 37 },
    { topic: "Assertion–reason: Plant hormones", chapter: "Plant Growth", lossPct: 44, affected: 29 },
    { topic: "Diagram: Nephron structure", chapter: "Excretory Products", lossPct: 38, affected: 22 },
  ],
  "kcet-1": [
    { topic: "Capacitors in combination", chapter: "Electrostatics", lossPct: 48, affected: 21 },
    { topic: "Kirchhoff's loop rule", chapter: "Current Electricity", lossPct: 41, affected: 17 },
    { topic: "Magnetic force on a wire", chapter: "Moving Charges", lossPct: 33, affected: 12 },
  ],
  "state-10k": [
    { topic: "Mirror formula sign rules", chapter: "Light", lossPct: 37, affected: 13 },
    { topic: "Acids and bases — pH", chapter: "Acids, Bases & Salts", lossPct: 29, affected: 9 },
    { topic: "Electric power problems", chapter: "Electricity", lossPct: 24, affected: 7 },
  ],
};

const names = [
  "Aarav Shetty", "Ananya Rao", "Bhavana K.", "Chirag Hegde", "Diya Nair", "Farhan Ali",
  "Gagan Gowda", "Ishita Menon", "Karthik Bhat", "Meghana S.", "Nikhil Prabhu", "Pooja Kulkarni",
];

const seeded = (seed: number) => () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

function buildStudents(classId: string, seed: number): Student[] {
  const rnd = seeded(seed);
  return names.map((name, i) => {
    const score = Math.round(38 + rnd() * 58);
    const daysAgo = [0, 1, 2, 9, 3, 0, 12, 1, 4, 8, 2, 0][(i + seed) % 12] ?? 0;
    const d = new Date(TODAY.getTime() - daysAgo * 86_400_000);
    return {
      id: `${classId}-${i}`,
      name,
      score,
      accuracy: Math.min(98, Math.round(score + (rnd() * 12 - 4))),
      lastActive: d.toISOString(),
    };
  });
}

export const studentsByClass: Record<string, Student[]> = Object.fromEntries(
  classes.map((c, i) => [c.id, buildStudents(c.id, i + 3)]),
);

export type TestStatus = "Draft" | "Scheduled" | "Live" | "Closed";
export type ManagedTest = {
  id: string;
  name: string;
  classId: string;
  date: string;
  questions: number;
  duration: number;
  status: TestStatus;
};

export const managedTests: ManagedTest[] = [
  { id: "m1", name: "NEET Full Mock #7", classId: "neet-b", date: "2026-11-18", questions: 180, duration: 200, status: "Live" },
  { id: "m2", name: "Carbon Compounds — Ch. 4", classId: "cbse-10a", date: "2026-11-21", questions: 30, duration: 45, status: "Scheduled" },
  { id: "m3", name: "KCET Physics Mock #4", classId: "kcet-1", date: "2026-11-24", questions: 60, duration: 80, status: "Scheduled" },
  { id: "m4", name: "Electricity — Kannada", classId: "state-10k", date: "2026-11-27", questions: 25, duration: 40, status: "Draft" },
  { id: "m5", name: "NEET Full Mock #6", classId: "neet-b", date: "2026-11-15", questions: 180, duration: 200, status: "Closed" },
];

export type ContentStatus = "Draft" | "In review" | "Published";
export type ContentItem = { id: string; title: string; kind: "Notes" | "Paper" | "Formula sheet"; track: Track; status: ContentStatus; updated: string };

export const contentItems: ContentItem[] = [
  { id: "c1", title: "Genetics one-page summary", kind: "Notes", track: "NEET", status: "Published", updated: "2 days ago" },
  { id: "c2", title: "CBSE 2025 Science — solved", kind: "Paper", track: "CBSE", status: "Published", updated: "5 days ago" },
  { id: "c3", title: "Electrostatics formula sheet", kind: "Formula sheet", track: "KCET", status: "In review", updated: "Yesterday" },
  { id: "c4", title: "Light — Kannada notes", kind: "Notes", track: "State", status: "In review", updated: "Today" },
  { id: "c5", title: "Plant hormones A–R set", kind: "Notes", track: "NEET", status: "Draft", updated: "Today" },
];

export type Doubt = { id: string; student: string; className: string; topic: string; question: string; ago: string; hasPhoto: boolean };

export const doubts: Doubt[] = [
  { id: "d1", student: "Ishita Menon", className: "NEET Batch B", topic: "Genetics", question: "Why is the F2 ratio 9:3:3:1 and not 3:1 for a dihybrid cross?", ago: "12 min", hasPhoto: true },
  { id: "d2", student: "Chirag Hegde", className: "KCET Sprint", topic: "Capacitors", question: "When capacitors are in series, why does the charge stay the same?", ago: "1 hr", hasPhoto: false },
  { id: "d3", student: "Diya Nair", className: "10 A", topic: "Redox", question: "How do I find which substance is oxidised in this reaction?", ago: "3 hr", hasPhoto: true },
  { id: "d4", student: "Gagan Gowda", className: "10 Kannada Medium", topic: "Mirrors", question: "Is the focal length of a concave mirror negative always?", ago: "Yesterday", hasPhoto: false },
];
