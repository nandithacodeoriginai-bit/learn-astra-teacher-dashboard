import { createFileRoute } from "@tanstack/react-router";
import { ClassSwitcher, PageHeader } from "@/components/dashboard/PageShell";
import { ClassPerformance } from "@/components/dashboard/Performance";
import { useCurrentClass } from "@/lib/teacher-store";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/performance")({
  head: () => pageHead("Class Performance", "Score distribution, average and pass rate for every test a class has taken."),
  component: PerformancePage,
});

function PerformancePage() {
  const { cls, results } = useCurrentClass();
  return (
    <>
      <PageHeader
        eyebrow="Class performance"
        title={cls.name}
        description="How the class scored on each test. Pick a test to see the spread of marks."
      >
        <ClassSwitcher />
      </PageHeader>
      <div key={cls.id} className="space-y-6">
        <ClassPerformance tests={results} />
        <section className="panel p-6">
          <h2 className="text-xl font-semibold">All tests</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="pb-2 font-medium">Test</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 text-right font-medium">Average</th>
                  <th className="pb-2 text-right font-medium">Pass rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {results.map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 font-semibold">{t.name}</td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-3 text-right tabular-nums">{t.avg}%</td>
                    <td className="py-3 text-right tabular-nums">{t.passRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
