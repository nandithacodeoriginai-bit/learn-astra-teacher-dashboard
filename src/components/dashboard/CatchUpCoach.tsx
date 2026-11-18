import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, RotateCcw, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getCatchUpPlan } from "@/lib/catch-up.functions";
import type { CatchUpInput, CatchUpPlan } from "@/lib/catch-up";

const GOALS = ["Next unit test", "Half-yearly exam", "Board exam", "Entrance mock test"];
const HOURS = ["Under 2 hours", "2–4 hours", "5–7 hours", "8+ hours"];

const ownerVariant = { Teacher: "default", Student: "soft", Parent: "warning" } as const;

/** Teacher edits the student's progress details, then asks AI for catch-up steps. */
export function CatchUpCoach({ initial }: { initial: CatchUpInput }) {
  const askAi = useServerFn(getCatchUpPlan);
  const [form, setForm] = useState<CatchUpInput>(initial);
  const [plan, setPlan] = useState<CatchUpPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // A different student was opened: start fresh.
  useEffect(() => {
    setForm(initial);
    setPlan(null);
    setError(null);
  }, [initial.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof CatchUpInput>(key: K, value: CatchUpInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const num = (v: string, max: number) => Math.max(0, Math.min(max, Math.round(Number(v) || 0)));

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await askAi({ data: form });
      if (res.ok) setPlan(res.plan);
      else setError(res.message);
    } catch {
      setError("Couldn't reach the AI right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyMessage() {
    if (!plan) return;
    await navigator.clipboard.writeText(plan.messageToStudent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="panel mt-5 p-4" aria-labelledby="catchup-title">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </span>
        <div>
          <h3 id="catchup-title" className="font-display text-lg font-semibold leading-tight">AI catch-up plan</h3>
          <p className="text-xs text-muted-foreground">Check the details, add what you've noticed, get next steps.</p>
        </div>
      </div>

      {!plan && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <NumField label="Latest score %" value={form.latestScore} onChange={(v) => set("latestScore", num(v, 100))} />
            <NumField label="Accuracy %" value={form.accuracy} onChange={(v) => set("accuracy", num(v, 100))} />
            <NumField label="Days inactive" value={form.daysInactive} onChange={(v) => set("daysInactive", num(v, 365))} />
          </div>

          {form.topics.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Topic accuracy (sent to AI)</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {form.topics.map((t) => (
                  <Badge key={t.topic} variant={t.accuracy < 50 ? "danger" : "soft"}>
                    {t.topic} · {t.accuracy}%
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Working towards</Label>
              <Select value={form.goal} onValueChange={(v) => set("goal", v)}>
                <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GOALS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Time per week</Label>
              <Select value={form.hoursPerWeek} onValueChange={(v) => set("hoursPerWeek", v)}>
                <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="catchup-notes" className="text-xs">What have you noticed? (optional)</Label>
            <Textarea
              id="catchup-notes"
              value={form.teacherNotes}
              maxLength={1500}
              onChange={(e) => set("teacherNotes", e.target.value)}
              placeholder="e.g. Understands concepts in class but rushes numericals. Missed two weeks for a family function."
              className="min-h-20 bg-card"
            />
          </div>

          {loading ? (
            <div className="space-y-2 pt-1" aria-live="polite">
              <p className="text-sm text-muted-foreground">Reading {form.name.split(" ")[0]}'s progress…</p>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <Button className="w-full" onClick={generate}>
              <Sparkles /> Get next steps
            </Button>
          )}

          {error && (
            <p role="alert" className="rounded-xl bg-danger-soft p-3 text-sm text-destructive">{error}</p>
          )}
        </div>
      )}

      {plan && (
        <div className="mt-4 space-y-4">
          <p className="text-sm leading-relaxed">{plan.summary}</p>

          {plan.likelyCauses.length > 0 && (
            <div>
              <p className="eyebrow">Likely reasons</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {plan.likelyCauses.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          )}

          <div>
            <p className="eyebrow">Next steps</p>
            <ol className="mt-2 space-y-2">
              {plan.steps.map((s, i) => (
                <li key={i} className="flex gap-3 rounded-2xl bg-card p-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold">{i + 1}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-sm font-semibold">{s.title}</p>
                      <Badge variant={ownerVariant[s.owner]}>{s.owner}</Badge>
                      <span className="text-[11px] text-muted-foreground">{s.when}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
            <p className="text-[11px] font-semibold uppercase tracking-wider opacity-70">Message for {form.name.split(" ")[0]}</p>
            <p className="mt-1.5 text-sm leading-relaxed">{plan.messageToStudent}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="cream" onClick={() => toast.success(`Message sent to ${form.name}`)}>
                <Send /> Send to student
              </Button>
              <Button size="sm" variant="ghost-cream" onClick={copyMessage}>
                {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <p className="text-sm"><span className="font-semibold">Check in after 7 days:</span> {plan.checkInGoal}</p>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <p className="text-[11px] text-muted-foreground">AI-suggested. Review before acting.</p>
            <Button size="sm" variant="soft" onClick={() => setPlan(null)}>
              <RotateCcw /> Edit details
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] leading-tight">{label}</Label>
      <Input type="number" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} className="bg-card" />
    </div>
  );
}
