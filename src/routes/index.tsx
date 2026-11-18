import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, FileDown, FileSpreadsheet, GraduationCap, MessageCircleQuestion, Search, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileNav, Sidebar } from "@/components/dashboard/Sidebar";
import { ClassPicker } from "@/components/dashboard/ClassPicker";
import { ClassPerformance, WeakTopics } from "@/components/dashboard/Performance";
import { StudentList } from "@/components/dashboard/StudentList";
import { TestManager } from "@/components/dashboard/TestManager";
import { ContentManager } from "@/components/dashboard/ContentManager";
import { DoubtInbox } from "@/components/dashboard/DoubtInbox";
import { Notifications } from "@/components/dashboard/Notifications";
import { StudentDetail } from "@/components/dashboard/StudentDetail";
import {
  classes,
  contentItems,
  doubts as initialDoubts,
  managedTests,
  studentsByClass,
  testsByClass,
  weakTopicsByClass,
  isInactive,
  notices,
  type ManagedTest,
  type Student,
} from "@/lib/teacher-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Teacher Dashboard — LearnAstra" },
      {
        name: "description",
        content: "See class performance, weak topics, students, tests, content and doubts in one LearnAstra lecturer dashboard.",
      },
      { property: "og:title", content: "Teacher Dashboard — LearnAstra" },
      {
        property: "og:description",
        content: "One place for lecturers to track classes, set tests and answer doubts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeacherDashboard,
});

const sectionIds = ["overview", "performance", "students", "tests", "content", "doubts", "export"];

function TeacherDashboard() {
  const [classId, setClassId] = useState("neet-b");
  const [tests, setTests] = useState<ManagedTest[]>(managedTests);
  const [doubts, setDoubts] = useState(initialDoubts);
  const [active, setActive] = useState("#overview");
  const [openStudent, setOpenStudent] = useState<Student | null>(null);

  const cls = classes.find((c) => c.id === classId)!;
  const students = studentsByClass[classId] ?? [];
  const classTests = testsByClass[classId] ?? [];
  const weak = weakTopicsByClass[classId] ?? [];

  const totalStudents = classes.reduce((s, c) => s + c.students, 0);
  const upcoming = tests.filter((t) => t.status === "Scheduled" || t.status === "Live").length;
  const avgScore = useMemo(
    () => Math.round(students.reduce((s, x) => s + x.score, 0) / Math.max(1, students.length)),
    [students],
  );
  const inactive = students.filter((s) => isInactive(s.lastActive)).length;

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const createRevision = () => {
    setTests((t) => [
      {
        id: `rev-${Date.now()}`,
        name: `Revision: ${weak[0]?.topic ?? cls.name}`,
        classId,
        date: "2026-11-23",
        questions: 20,
        duration: 30,
        status: "Draft",
      },
      ...t,
    ]);
    toast.success("Revision test drafted", { description: `Covers the 3 weakest topics of ${cls.name}.` });
    document.getElementById("tests")?.scrollIntoView({ behavior: "smooth" });
  };

  const exportCsv = () => {
    const header = "Student,Latest score (%),Accuracy (%),Last active,Inactive over 7 days";
    const rows = students.map(
      (s) => `"${s.name}",${s.score},${s.accuracy},${s.lastActive.slice(0, 10)},${isInactive(s.lastActive) ? "Yes" : "No"}`,
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cls.name.replace(/\s+/g, "-")}-results.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded", { description: `${students.length} students from ${cls.name}` });
  };

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar active={active} openDoubts={doubts.length} />

      <main className="min-w-0 flex-1 px-5 py-6 md:px-10 md:py-8">
        <MobileNav active={active} openDoubts={doubts.length} />

        {/* Top bar */}
        <header className="flex flex-wrap items-center justify-between gap-4" data-print-hide>
          <p className="text-sm text-muted-foreground">Wednesday, 18 November 2026</p>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search tests, topics, students" className="h-10 w-72 rounded-full bg-card pl-9" />
            </div>
            <Notifications items={notices} />
          </div>
        </header>

        {/* Greeting */}
        <section id="overview" className="rise-in scroll-mt-6 pt-8">
          <h1 className="text-4xl leading-[1.05] font-semibold md:text-6xl">
            Good afternoon,
            <br />
            <span className="italic font-medium">Sneha.</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {doubts.length} doubts are waiting, and {inactive} students in {cls.name} haven't practised this week.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat icon={GraduationCap} label="Students across classes" value={totalStudents} />
            <Stat icon={TrendingUp} label={`Avg. score · ${cls.name}`} value={`${avgScore}%`} />
            <Stat icon={ClipboardCheck} label="Live & scheduled tests" value={upcoming} />
            <Stat icon={MessageCircleQuestion} label="Unanswered doubts" value={doubts.length} highlight />
          </div>
        </section>

        {/* Classes */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="eyebrow">My classes</p>
              <h2 className="mt-1 text-2xl font-semibold">Pick a class to explore</h2>
            </div>
          </div>
          <ClassPicker classes={classes} activeId={classId} onSelect={setClassId} />
        </section>

        {/* Performance + weak topics */}
        <div key={classId} className="rise-in mt-6 grid gap-6 xl:grid-cols-3 [&>*]:min-w-0">
          <div className="xl:col-span-2">
            <ClassPerformance tests={classTests} />
          </div>
          <WeakTopics topics={weak} onCreateRevision={createRevision} />
          <div className="xl:col-span-2">
            <StudentList students={students} onOpen={setOpenStudent} />
          </div>
          <DoubtInbox doubts={doubts} onAnswer={(id) => setDoubts((d) => d.filter((x) => x.id !== id))} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-5 [&>*]:min-w-0">
          <div className="xl:col-span-3">
            <TestManager tests={tests} classes={classes} onChange={setTests} />
          </div>
          <div className="xl:col-span-2">
            <ContentManager initialItems={contentItems} />
          </div>
        </div>

        {/* Export */}
        <section id="export" className="panel-ink relative mt-6 scroll-mt-6 overflow-hidden p-6 md:p-8" data-print-hide>
          <div className="grain pointer-events-none absolute inset-0" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="eyebrow text-primary-foreground/60">Export</p>
              <h2 className="mt-1 text-3xl font-semibold">Share {cls.name} results</h2>
              <p className="mt-1 text-sm text-primary-foreground/65">
                Scores, accuracy and activity for every student, ready for parents or management.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="cream" size="lg" onClick={exportCsv}>
                <FileSpreadsheet /> Download CSV
              </Button>
              <Button variant="ghost-cream" size="lg" onClick={() => window.print()}>
                <FileDown /> Save as PDF
              </Button>
            </div>
          </div>
        </section>

        <StudentDetail
          student={openStudent}
          classId={classId}
          className={cls.name}
          onClose={() => setOpenStudent(null)}
        />

        <p className="mt-8 pb-4 text-center text-xs text-muted-foreground">LearnAstra · Teacher dashboard prototype</p>
      </main>
    </div>
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
