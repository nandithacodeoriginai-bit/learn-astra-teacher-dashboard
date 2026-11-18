import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { ArrowRight, Target, TrendingDown } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { TestResult, WeakTopic } from "@/lib/teacher-data";

const chartConfig = {
  students: { label: "Students", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function ClassPerformance({ tests }: { tests: TestResult[] }) {
  const [testId, setTestId] = useState(tests[0]?.id);
  const test = tests.find((t) => t.id === testId) ?? tests[0];
  if (!test) return null;
  const total = test.distribution.reduce((s, d) => s + d.students, 0);

  return (
    <section id="performance" className="panel scroll-mt-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Class performance</p>
          <h2 className="mt-1 text-2xl font-semibold">Score distribution</h2>
        </div>
        <Select value={test.id} onValueChange={setTestId}>
          <SelectTrigger className="w-full rounded-full bg-background sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tests.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr]">
        <div className="flex flex-row gap-3 md:flex-col">
          <Metric label="Average score" value={`${test.avg}%`} />
          <Metric label="Pass rate" value={`${test.passRate}%`} />
          <Metric label="Attempted" value={`${total}`} />
        </div>
        <ChartContainer config={chartConfig} className="aspect-auto h-60 w-full">
          <BarChart data={test.distribution} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 6" />
            <XAxis dataKey="band" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
            <Bar dataKey="students" radius={[12, 12, 4, 4]} maxBarSize={56}>
              {test.distribution.map((d, i) => (
                <Cell key={d.band} fill={i < 2 ? "var(--chart-5)" : i === 4 ? "var(--chart-1)" : "var(--chart-2)"} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Held on {new Date(test.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        {" · "}Bars in terracotta are students scoring 40% or below.
      </p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-2xl bg-background p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}

export function WeakTopics({
  topics,
  onCreateRevision,
}: {
  topics: WeakTopic[];
  onCreateRevision: () => void;
}) {
  return (
    <section className="panel-ink relative overflow-hidden p-6">
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-primary-foreground/60">Weak topics of the class</p>
          <TrendingDown className="size-4 text-primary-foreground/60" />
        </div>
        <h2 className="mt-1 text-2xl font-semibold">Where marks slip</h2>

        <ul className="mt-6 space-y-5">
          {topics.map((t, i) => (
            <li key={t.topic}>
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold leading-snug">
                    <span className="mr-2 font-display text-primary-foreground/50">0{i + 1}</span>
                    {t.topic}
                  </p>
                  <p className="text-xs text-primary-foreground/55">
                    {t.chapter} · {t.affected} students
                  </p>
                </div>
                <span className="font-display text-2xl font-semibold">{t.lossPct}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary-foreground/15">
                <div
                  className="h-full rounded-full bg-primary-foreground"
                  style={{ width: `${t.lossPct}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-primary-foreground/55">% of marks lost on these topics</p>

        <Button
          variant="cream"
          className="mt-6 w-full"
          onClick={onCreateRevision}
        >
          <Target /> Create revision test <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
