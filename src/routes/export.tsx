import { createFileRoute } from "@tanstack/react-router";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ClassSwitcher, PageHeader } from "@/components/dashboard/PageShell";
import { isInactive } from "@/lib/teacher-data";
import { useCurrentClass } from "@/lib/teacher-store";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/export")({
  head: () => pageHead("Export Results", "Download a class's results as a spreadsheet or save them as a PDF."),
  component: ExportPage,
});

function ExportPage() {
  const { cls, students } = useCurrentClass();

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
    <>
      <PageHeader eyebrow="Export results" title={`Share ${cls.name} results`}>
        <div data-print-hide>
          <ClassSwitcher />
        </div>
      </PageHeader>

      <section className="panel-ink relative overflow-hidden p-6 md:p-8" data-print-hide>
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-md text-sm text-primary-foreground/75">
            Scores, accuracy and activity for every student, ready for parents or management.
          </p>
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

      <section className="panel mt-6 p-6">
        <h2 className="text-xl font-semibold">Preview · {students.length} students</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="pb-2 font-medium">Student</th>
                <th className="pb-2 text-right font-medium">Score</th>
                <th className="pb-2 text-right font-medium">Accuracy</th>
                <th className="pb-2 text-right font-medium">Inactive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="py-2.5 font-semibold">{s.name}</td>
                  <td className="py-2.5 text-right tabular-nums">{s.score}%</td>
                  <td className="py-2.5 text-right tabular-nums">{s.accuracy}%</td>
                  <td className="py-2.5 text-right">{isInactive(s.lastActive) ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
