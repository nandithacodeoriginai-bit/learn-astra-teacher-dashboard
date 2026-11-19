import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ClassSwitcher, PageHeader } from "@/components/dashboard/PageShell";
import { StudentList } from "@/components/dashboard/StudentList";
import { StudentDetail } from "@/components/dashboard/StudentDetail";
import type { Student } from "@/lib/teacher-data";
import { useCurrentClass } from "@/lib/teacher-store";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/students")({
  head: () =>
    pageHead("Student List", "Every student's score, accuracy and last activity, with inactive students flagged."),
  component: StudentsPage,
});

function StudentsPage() {
  const { cls, students } = useCurrentClass();
  const [open, setOpen] = useState<Student | null>(null);
  return (
    <>
      <PageHeader
        eyebrow="Student list"
        title={cls.name}
        description="Click a student to see their progress and get an AI catch-up plan."
      >
        <ClassSwitcher />
      </PageHeader>
      <StudentList key={cls.id} students={students} onOpen={setOpen} />
      <StudentDetail student={open} classId={cls.id} className={cls.name} onClose={() => setOpen(null)} />
    </>
  );
}
