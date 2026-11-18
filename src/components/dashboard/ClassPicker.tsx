import { Users } from "lucide-react";
import type { ClassInfo } from "@/lib/teacher-data";

export function ClassPicker({
  classes,
  activeId,
  onSelect,
}: {
  classes: ClassInfo[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {classes.map((c) => {
        const active = c.id === activeId;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            aria-pressed={active}
            className={
              "group relative overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 " +
              (active
                ? "border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-lift)] -translate-y-0.5"
                : "border-border bg-card hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]")
            }
          >
            {active && <div className="grain pointer-events-none absolute inset-0" />}
            <div className="relative flex items-center justify-between">
              <span
                className={
                  "rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase " +
                  (active ? "bg-primary-foreground text-primary" : "bg-primary-soft text-primary")
                }
              >
                {c.track}
              </span>
              <span
                className={
                  "text-xs font-medium " +
                  (active ? "text-primary-foreground/70" : "text-muted-foreground")
                }
              >
                {c.grade}
              </span>
            </div>
            <p className="relative mt-5 font-display text-2xl leading-tight font-semibold">{c.name}</p>
            <div
              className={
                "relative mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm " +
                (active ? "text-primary-foreground/75" : "text-muted-foreground")
              }
            >
              <span>{c.subject}</span>
              <span>·</span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <Users className="size-3.5" />
                {c.students} students
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
