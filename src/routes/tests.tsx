import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageShell";
import { TestManager } from "@/components/dashboard/TestManager";
import { classes } from "@/lib/teacher-data";
import { useTeacher } from "@/lib/teacher-store";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/tests")({
  head: () => pageHead("Test Manager", "Create, schedule and close tests for each of your classes."),
  component: TestsPage,
});

function TestsPage() {
  const { tests, setTests } = useTeacher();
  return (
    <>
      <PageHeader eyebrow="Test manager" title="Tests" description="Create new tests, schedule them and close them when done." />
      <TestManager tests={tests} classes={classes} onChange={setTests} />
    </>
  );
}
