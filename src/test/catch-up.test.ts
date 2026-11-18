import { describe, expect, it } from "vitest";
import { catchUpInputSchema, tidyPlan, type CatchUpPlan } from "@/lib/catch-up";

const step = (n: number) => ({ title: `Step ${n}`, detail: "d", when: "Today", owner: "Teacher" as const });

describe("catch-up plan", () => {
  it("shows at most 5 next steps", () => {
    const plan: CatchUpPlan = {
      summary: "s",
      likelyCauses: ["a"],
      steps: [1, 2, 3, 4, 5, 6, 7].map(step),
      messageToStudent: "m",
      checkInGoal: "g",
    };
    expect(tidyPlan(plan).steps).toHaveLength(5);
  });

  it("shows at most 3 likely reasons", () => {
    const plan: CatchUpPlan = {
      summary: "s",
      likelyCauses: ["a", "b", "c", "d"],
      steps: [step(1)],
      messageToStudent: "m",
      checkInGoal: "g",
    };
    expect(tidyPlan(plan).likelyCauses).toEqual(["a", "b", "c"]);
  });

  it("rejects a score above 100%", () => {
    const base = {
      name: "Asha", className: "10 A", subject: "Science", track: "CBSE",
      latestScore: 101, accuracy: 50, testsTaken: 3, daysInactive: 2, streak: 0,
      trend: [], topics: [], goal: "", hoursPerWeek: "", teacherNotes: "",
    };
    expect(catchUpInputSchema.safeParse(base).success).toBe(false);
    expect(catchUpInputSchema.safeParse({ ...base, latestScore: 100 }).success).toBe(true);
  });
});
