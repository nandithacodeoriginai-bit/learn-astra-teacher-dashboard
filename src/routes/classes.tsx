import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageShell";
import { ClassPicker } from "@/components/dashboard/ClassPicker";
import { classes, isInactive } from "@/lib/teacher-data";
import { useCurrentClass, useTeacher } from "@/lib/teacher-store";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/classes")({
  head: () => pageHead("My Classes", "All classes assigned to you, with students, latest averages and quick links."),
  component: ClassesPage,
});

function ClassesPage() {
  const { classId, setClassId } = useTeacher();
  const { cls, students, results, weak } = useCurrentClass();
  const latest = results.at(-1);
  const inactive = students.filter((s) => isInactive(s.lastActive)).length;

  return (
    <>
      <PageHeader
        eyebrow="My classes"
        title="Your assigned classes"
        description="Pick a class to see its numbers. The other pages follow the class you pick here."
      />
      <ClassPicker classes={classes} activeId={classId} onSelect={setClassId} />

      <section key={cls.id} className="panel rise-in mt-6 p-6">
        <p className="eyebrow">Selected class</p>
        <h2 className="mt-1 text-2xl font-semibold">
          {cls.name} · {cls.track} {cls.subject}
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Fact label="Students" value={cls.students} />
          <Fact label="Latest test average" value={latest ? `${latest.avg}%` : "—"} />
          <Fact label="Inactive over 7 days" value={inactive} />
          <Fact label="Weakest topic" value={weak[0]?.topic ?? "—"} small />
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold">
          <QuickLink to="/performance">Class performance</QuickLink>
          <QuickLink to="/weak-topics">Weak topics</QuickLink>
          <QuickLink to="/students">Student list</QuickLink>
        </div>
      </section>
    </>
  );
}

function Fact({ label, value, small }: { label: string; value: string | number; small?: boolean }) {
  return (
    <div className="rounded-2xl bg-background p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={"mt-1 font-display font-semibold " + (small ? "text-lg leading-snug" : "text-3xl")}>{value}</p>
    </div>
  );
}

function QuickLink({ to, children }: { to: "/performance" | "/weak-topics" | "/students"; children: string }) {
  return (
    <Link to={to} className="flex items-center gap-1 underline-offset-4 hover:underline">
      {children} <ArrowRight className="size-3.5" />
    </Link>
  );
}
