import { z } from "zod/v4";

// What the teacher sends about a student. Shared by browser form and server.
export const catchUpInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  className: z.string().trim().max(80),
  subject: z.string().trim().max(60),
  track: z.string().trim().max(20),
  latestScore: z.number().min(0).max(100),
  accuracy: z.number().min(0).max(100),
  testsTaken: z.number().int().min(0).max(500),
  daysInactive: z.number().int().min(0).max(365),
  streak: z.number().int().min(0).max(365),
  trend: z.array(z.number().min(0).max(100)).max(12),
  topics: z
    .array(z.object({ topic: z.string().trim().max(80), accuracy: z.number().min(0).max(100) }))
    .max(12),
  goal: z.string().trim().max(80),
  hoursPerWeek: z.string().trim().max(40),
  teacherNotes: z.string().trim().max(1500),
});
export type CatchUpInput = z.infer<typeof catchUpInputSchema>;

export const OWNERS = ["Teacher", "Student", "Parent"] as const;

// Strict-compatible schema: every field required, no bounds (counts are asked for in the prompt).
export const catchUpPlanSchema = z.object({
  summary: z.string(),
  likelyCauses: z.array(z.string()),
  steps: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
      when: z.string(),
      owner: z.enum(OWNERS),
    }),
  ),
  messageToStudent: z.string(),
  checkInGoal: z.string(),
});
export type CatchUpPlan = z.infer<typeof catchUpPlanSchema>;

export type CatchUpResult = { ok: true; plan: CatchUpPlan } | { ok: false; message: string };

/** Turns the teacher's details into the prompt the model reads. */
export function describeStudent(i: CatchUpInput): string {
  const topics = i.topics.length
    ? i.topics.map((t) => `- ${t.topic}: ${t.accuracy}% accuracy`).join("\n")
    : "- (none provided)";
  return [
    `Student: ${i.name}`,
    `Class: ${i.className} · ${i.track} · ${i.subject}`,
    `Latest test score: ${i.latestScore}%`,
    `Overall accuracy: ${i.accuracy}%`,
    `Tests taken: ${i.testsTaken}`,
    `Score trend (oldest to latest): ${i.trend.length ? i.trend.join(", ") : "not provided"}`,
    `Days since last practice: ${i.daysInactive}`,
    `Current practice streak: ${i.streak} days`,
    `Topic accuracy:\n${topics}`,
    `Goal: ${i.goal || "not given"}`,
    `Time the student can give per week: ${i.hoursPerWeek || "not given"}`,
    `Teacher's notes: ${i.teacherNotes || "none"}`,
  ].join("\n");
}

/** Keeps the plan to the sizes the panel is designed for. */
export function tidyPlan(plan: CatchUpPlan): CatchUpPlan {
  return {
    ...plan,
    likelyCauses: plan.likelyCauses.filter(Boolean).slice(0, 3),
    steps: plan.steps.filter((s) => s.title.trim()).slice(0, 5),
  };
}
