import { describe, expect, it } from "vitest";
import { isInactive } from "@/lib/teacher-data";

const today = new Date("2026-11-18T09:00:00Z");
const daysAgo = (n: number) => new Date(today.getTime() - n * 86_400_000).toISOString();

describe("student inactivity flag", () => {
  it("does not flag a student active exactly 7 days ago", () => {
    expect(isInactive(daysAgo(7), today)).toBe(false);
  });
  it("flags a student with no activity for 8 days", () => {
    expect(isInactive(daysAgo(8), today)).toBe(true);
  });
});
