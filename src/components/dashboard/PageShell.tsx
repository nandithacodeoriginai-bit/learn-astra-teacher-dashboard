import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MobileNav, Sidebar } from "@/components/dashboard/Sidebar";
import { Notifications } from "@/components/dashboard/Notifications";
import { classes, notices } from "@/lib/teacher-data";
import { TeacherProvider, useTeacher } from "@/lib/teacher-store";

/** Sidebar + top bar around every dashboard page. */
export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <TeacherProvider>
      <ShellFrame>{children}</ShellFrame>
    </TeacherProvider>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  const { doubts } = useTeacher();
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar openDoubts={doubts.length} />
      <main className="min-w-0 flex-1 px-5 py-6 md:px-10 md:py-8">
        <MobileNav openDoubts={doubts.length} />
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
        <div className="rise-in pt-8">{children}</div>
        <p className="mt-10 pb-4 text-center text-xs text-muted-foreground">LearnAstra · Teacher dashboard prototype</p>
      </main>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-4xl leading-[1.05] font-semibold md:text-5xl">{title}</h1>
        {description && <p className="mt-3 text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

/** Compact class dropdown for pages that show one class at a time. */
export function ClassSwitcher() {
  const { classId, setClassId } = useTeacher();
  return (
    <Select value={classId} onValueChange={setClassId}>
      <SelectTrigger className="w-full rounded-full bg-card sm:w-64" aria-label="Class">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {classes.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name} · {c.track}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
