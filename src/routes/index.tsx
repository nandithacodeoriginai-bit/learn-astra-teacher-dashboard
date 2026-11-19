import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Camera, ClipboardCheck, GraduationCap, MessageCircleQuestion, School, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ClassSwitcher } from "@/components/dashboard/PageShell";
import { PreviewCard } from "@/components/dashboard/PreviewCard";
import { classes, isInactive } from "@/lib/teacher-data";
import { useCurrentClass, useTeacher } from "@/lib/teacher-store";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Dashboard",
      "See class performance, weak topics, students, tests, content and doubts at a glance in the LearnAstra lecturer dashboard.",
    ),
  component: DashboardPage,
});

const chartConfig = { avg: { label: "Average score", color: "var(--chart-1)" } } satisfies ChartConfig;

function DashboardPage() {
  const { tests, content, doubts } = useTeacher();
  const { cls, students, results, weak } = useCurrentClass();

  const totalStudents = classes.reduce((s, c) => s + c.students, 0);
  const upcoming = tests.filter((t) => t.status === "Scheduled" || t.status === "Live");
  const avgScore = Math.round(students.reduce((s, x) => s + x.score, 0) / Math.max(1, students.length));
  const inactive = students.filter((s) => isInactive(s.lastActive));
  const className = (id: string) => classes.find((c) => c.id === id)?.name ?? "";

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Teacher dashboard</p>
          <h1 className="mt-2 text-4xl leading-[1.05] font-semibold md:text-6xl">
            Good afternoon, <span className="italic font-medium">Sneha.</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {doubts.length} doubts are waiting, and {inactive.length} students in {cls.name} haven't practised this week.
          </p>
        </div>
        <ClassSwitcher />
      </section>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={GraduationCap} label="Students across classes" value={totalStudents} />
        <Stat icon={TrendingUp} label={`Avg. score · ${cls.name}`} value={`${avgScore}%`} />
        <Stat icon={ClipboardCheck} label="Live & scheduled tests" value={upcoming.length} />
        <Stat icon={MessageCircleQuestion} label="Unanswered doubts" value={doubts.length} highlight />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <PreviewCard title="My Classes" to="/classes">
          <ul className="space-y-2.5">
            {classes.map((c) => (
              <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-background p-3">
                <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <School className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.track} · {c.subject} · {c.students} students
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </PreviewCard>

        <PreviewCard title="Class Performance" to="/performance" linkLabel="Details">
          <p className="mb-2 text-xs text-muted-foreground">Average score per test · {cls.name}</p>
          <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
            <BarChart data={results} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 6" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} interval={0} />
              <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
              <Bar dataKey="avg" fill="var(--chart-1)" radius={[10, 10, 4, 4]} maxBarSize={56} />
            </BarChart>
          </ChartContainer>
        </PreviewCard>

        <PreviewCard title="Weak Topics of the Class" to="/weak-topics">
          <ul className="space-y-3">
            {weak.slice(0, 3).map((t) => (
              <li key={t.topic} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug">{t.topic}</p>
                  <p className="text-xs text-muted-foreground">{t.chapter}</p>
                </div>
                <Badge variant="danger">{t.lossPct}% marks lost</Badge>
              </li>
            ))}
          </ul>
        </PreviewCard>

        <PreviewCard title="Student List" to="/students" linkLabel="Manage">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-background p-4">
              <p className="text-xs font-medium text-muted-foreground">Students in {cls.name}</p>
              <p className="mt-2 font-display text-3xl font-semibold">{students.length}</p>
            </div>
            <div className="panel-ink p-4">
              <p className="text-xs font-medium text-primary-foreground/70">Inactive over 7 days</p>
              <p className="mt-2 font-display text-3xl font-semibold">{inactive.length}</p>
            </div>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {[...students]
              .sort((a, b) => a.score - b.score)
              .slice(0, 3)
              .map((s) => (
                <li key={s.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-semibold">{s.name}</span>
                  <Badge variant={s.score < 40 ? "danger" : "soft"}>{s.score}%</Badge>
                </li>
              ))}
          </ul>
        </PreviewCard>

        <PreviewCard title="Test Manager" to="/tests" linkLabel="Manage">
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tests scheduled.</p>
          ) : (
            <ul className="space-y-2.5">
              {upcoming.slice(0, 3).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 rounded-2xl bg-background p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {className(t.classId)} ·{" "}
                      {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <Badge variant={t.status === "Live" ? "success" : "soft"}>{t.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </PreviewCard>

        <PreviewCard title="Content Manager" to="/content" linkLabel="Manage">
          <div className="grid grid-cols-3 gap-3">
            {(["Draft", "In review", "Published"] as const).map((s) => (
              <div key={s} className="rounded-2xl bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground">{s}</p>
                <p className="mt-2 font-display text-3xl font-semibold">{content.filter((c) => c.status === s).length}</p>
              </div>
            ))}
          </div>
        </PreviewCard>

        <PreviewCard title="Doubt Inbox" to="/doubts" linkLabel="Open inbox" ink>
          {doubts.length === 0 ? (
            <p className="text-sm text-primary-foreground/70">Every doubt has an answer.</p>
          ) : (
            <ul className="space-y-3">
              {doubts.slice(0, 2).map((d) => (
                <li key={d.id} className="rounded-2xl bg-primary-foreground/10 p-3">
                  <div className="flex items-center justify-between text-xs text-primary-foreground/65">
                    <span className="font-bold text-primary-foreground">{d.student}</span>
                    <span>{d.ago}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm">{d.question}</p>
                  {d.hasPhoto && (
                    <span className="mt-1 flex items-center gap-1 text-xs text-primary-foreground/60">
                      <Camera className="size-3" /> Photo attached
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </PreviewCard>

        <PreviewCard title="Export Results" to="/export" linkLabel="Export">
          <p className="text-sm text-muted-foreground">
            Download scores, accuracy and activity for {cls.name} as a spreadsheet, or save a PDF for parents and
            management.
          </p>
          <Link to="/export" className="mt-4 inline-block text-sm font-bold underline underline-offset-4">
            Go to export →
          </Link>
        </PreviewCard>
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className={highlight ? "panel-ink p-5" : "panel p-5"}>
      <Icon className={"size-5 " + (highlight ? "text-primary-foreground/70" : "text-muted-foreground")} />
      <p className="mt-6 font-display text-4xl font-semibold tabular-nums">{value}</p>
      <p className={"mt-1 text-xs font-medium " + (highlight ? "text-primary-foreground/65" : "text-muted-foreground")}>
        {label}
      </p>
    </div>
  );
}
