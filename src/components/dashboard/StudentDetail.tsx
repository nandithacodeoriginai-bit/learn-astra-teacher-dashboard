import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { AlertTriangle, BellRing, Flame, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { daysSince, getStudentDetail, isInactive, type Student } from "@/lib/teacher-data";

const config = { score: { label: "Score", color: "var(--chart-1)" } } satisfies ChartConfig;

export function StudentDetail({
  student,
  classId,
  className,
  onClose,
}: {
  student: Student | null;
  classId: string;
  className: string;
  onClose: () => void;
}) {
  const detail = student ? getStudentDetail(student, classId) : null;
  const inactive = student ? isInactive(student.lastActive) : false;

  return (
    <Sheet open={!!student} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto bg-background sm:max-w-md">
        {student && detail && (
          <>
            <SheetHeader className="text-left">
              <p className="eyebrow">{className}</p>
              <SheetTitle className="font-display text-3xl font-semibold">{student.name}</SheetTitle>
              <SheetDescription>
                Last active {daysSince(student.lastActive) === 0 ? "today" : `${daysSince(student.lastActive)} days ago`}
              </SheetDescription>
            </SheetHeader>

            {inactive && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-danger-soft p-4 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <p>No practice in over 7 days. A reminder may help them get back on track.</p>
              </div>
            )}

            <div className="mt-5 grid grid-cols-3 gap-2">
              <Mini label="Latest score" value={`${student.score}%`} />
              <Mini label="Accuracy" value={`${student.accuracy}%`} />
              <Mini label="Tests taken" value={`${detail.testsTaken}`} />
            </div>

            <div className="panel mt-5 p-4">
              <p className="eyebrow">Score trend</p>
              <ChartContainer config={config} className="mt-3 aspect-auto h-40 w-full">
                <LineChart data={detail.trend} margin={{ left: -24, right: 8, top: 6 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 6" />
                  <XAxis dataKey="test" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
                  <Line dataKey="score" type="monotone" stroke="var(--color-score)" strokeWidth={2.5} dot={{ r: 3.5, fill: "var(--color-score)" }} />
                </LineChart>
              </ChartContainer>
            </div>

            <div className="panel mt-4 p-4">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Accuracy by topic</p>
                <ListChecks className="size-4 text-muted-foreground" />
              </div>
              <ul className="mt-3 space-y-3">
                {detail.topics.map((t, i) => (
                  <li key={t.topic}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">
                        {t.topic}
                        {i === 0 && t.accuracy < 60 && (
                          <Badge variant="danger" className="ml-2">Weakest</Badge>
                        )}
                      </span>
                      <span className="tabular-nums">{t.accuracy}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={"h-full rounded-full " + (t.accuracy < 50 ? "bg-destructive" : "bg-primary")}
                        style={{ width: `${t.accuracy}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="size-4" />
              {detail.streak > 0 ? `${detail.streak}-day practice streak` : "No current practice streak"}
            </div>

            <div className="mt-6 flex flex-wrap gap-2 pb-2">
              <Button
                onClick={() => toast.success(`Reminder sent to ${student.name}`, { description: "They'll get a push and email nudge." })}
              >
                <BellRing /> Send reminder
              </Button>
              <Button
                variant="soft"
                onClick={() =>
                  toast.success("Practice set assigned", {
                    description: `${detail.topics[0]?.topic ?? "Weak topic"} · 15 questions`,
                  })
                }
              >
                Assign practice on weakest topic
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-3">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
