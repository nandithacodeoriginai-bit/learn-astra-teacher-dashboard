import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ClassSwitcher, PageHeader } from "@/components/dashboard/PageShell";
import { WeakTopics } from "@/components/dashboard/Performance";
import { useCurrentClass, useTeacher } from "@/lib/teacher-store";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/weak-topics")({
  head: () => pageHead("Weak Topics", "The topics where a class loses the most marks, ready to turn into a revision test."),
  component: WeakTopicsPage,
});

function WeakTopicsPage() {
  const { addRevisionTest } = useTeacher();
  const { cls, weak } = useCurrentClass();
  const navigate = useNavigate();

  const createRevision = () => {
    addRevisionTest();
    toast.success("Revision test drafted", { description: `Covers the weakest topics of ${cls.name}.` });
    navigate({ to: "/tests" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Weak topics"
        title={cls.name}
        description="Where the class loses the most marks. Turn them into a revision test in one click."
      >
        <ClassSwitcher />
      </PageHeader>
      <div key={cls.id} className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <WeakTopics topics={weak} onCreateRevision={createRevision} />
        <section className="panel p-6">
          <h2 className="text-xl font-semibold">Students affected</h2>
          <ul className="mt-5 space-y-4">
            {weak.map((t) => (
              <li key={t.topic}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-semibold">{t.topic}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {t.affected} of {cls.students}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.round((t.affected / cls.students) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
