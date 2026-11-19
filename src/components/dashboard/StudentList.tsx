import { useMemo, useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { daysSince, isInactive, type Student } from "@/lib/teacher-data";

function lastActiveLabel(iso: string) {
  const d = daysSince(iso);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  return `${d} days ago`;
}

export function StudentList({
  students,
  onOpen,
}: {
  students: Student[];
  onOpen: (s: Student) => void;
}) {
  const [q, setQ] = useState("");
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const flaggedCount = students.filter((s) => isInactive(s.lastActive)).length;

  const rows = useMemo(
    () =>
      students
        .filter((s) => s.name.toLowerCase().includes(q.toLowerCase()))
        .filter((s) => !onlyFlagged || isInactive(s.lastActive))
        .sort((a, b) => b.score - a.score),
    [students, q, onlyFlagged],
  );

  return (
    <section id="students" className="panel scroll-mt-6 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Student list</p>
          <h2 className="mt-1 text-2xl font-semibold">Who's on track</h2>
          <p className="mt-1 text-xs text-muted-foreground">Tap a student to see their progress.</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <button
            onClick={() => setOnlyFlagged((v) => !v)}
            aria-pressed={onlyFlagged}
            className={
              "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-colors " +
              (onlyFlagged
                ? "bg-destructive text-destructive-foreground"
                : "bg-danger-soft text-destructive hover:bg-destructive/20")
            }
          >
            <AlertTriangle className="size-3.5" />
            {flaggedCount} inactive over 7 days
          </button>
          <div className="relative min-w-40 flex-1 sm:flex-none">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search student"
              className="h-9 w-full rounded-full bg-background pl-9 sm:w-48"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="pr-3 pb-3 font-semibold">Student</th>
              <th className="pr-3 pb-3 font-semibold">Score</th>
              <th className="hidden pb-3 font-semibold sm:table-cell">Accuracy</th>
              <th className="pb-3 font-semibold">Last active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const flagged = isInactive(s.lastActive);
              const initials = s.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2);
              return (
                <tr
                  key={s.id}
                  onClick={() => onOpen(s)}
                  className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-background/70"
                >
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="hidden size-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold sm:grid">
                        {initials}
                      </div>
                      <button
                        type="button"
                        className="text-left font-semibold underline-offset-4 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen(s);
                        }}
                      >
                        {s.name}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-secondary sm:block">
                        <div
                          className={"h-full rounded-full " + (s.score < 50 ? "bg-destructive" : "bg-primary")}
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                      <span className="font-semibold tabular-nums">{s.score}%</span>
                    </div>
                  </td>
                  <td className="hidden py-3 tabular-nums text-muted-foreground sm:table-cell">{s.accuracy}%</td>
                  <td className="py-3">
                    {flagged ? (
                      <Badge variant="danger" className="gap-1">
                        <AlertTriangle className="size-3" /> {lastActiveLabel(s.lastActive)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">{lastActiveLabel(s.lastActive)}</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-10 text-center text-muted-foreground">
                  No students match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
