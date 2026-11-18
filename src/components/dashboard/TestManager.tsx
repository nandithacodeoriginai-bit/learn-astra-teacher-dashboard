import { useState } from "react";
import { CalendarDays, Clock, FileUp, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClassInfo, ManagedTest, TestStatus } from "@/lib/teacher-data";

const statusVariant: Record<TestStatus, "success" | "soft" | "warning" | "outline"> = {
  Live: "success",
  Scheduled: "soft",
  Draft: "warning",
  Closed: "outline",
};

export function TestManager({
  tests,
  classes,
  onChange,
}: {
  tests: ManagedTest[];
  classes: ClassInfo[];
  onChange: (tests: ManagedTest[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    classId: classes[0]?.id ?? "",
    date: "2026-11-25",
    questions: "30",
    duration: "45",
  });

  const className = (id: string) => classes.find((c) => c.id === id)?.name ?? "";

  const setStatus = (id: string, status: TestStatus) => {
    onChange(tests.map((t) => (t.id === id ? { ...t, status } : t)));
    toast.success(`Test marked ${status.toLowerCase()}`);
  };

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onChange([
      {
        id: `new-${Date.now()}`,
        name: form.name.trim(),
        classId: form.classId,
        date: form.date,
        questions: Number(form.questions) || 0,
        duration: Number(form.duration) || 0,
        status: "Scheduled",
      },
      ...tests,
    ]);
    setOpen(false);
    setForm((f) => ({ ...f, name: "" }));
    toast.success("Test scheduled", { description: `${form.name} for ${className(form.classId)}` });
  };

  return (
    <section id="tests" className="panel scroll-mt-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Test manager</p>
          <h2 className="mt-1 text-2xl font-semibold">Your tests</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="soft"
            size="sm"
            onClick={() => toast("Bulk import", { description: "Upload a CSV or Word file of questions (prototype)." })}
          >
            <FileUp /> Bulk import
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus /> Create test
          </Button>
        </div>
      </div>

      <ul className="mt-5 divide-y divide-border/70">
        {tests.map((t) => (
          <li key={t.id} className="flex items-center gap-4 py-3.5">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-background text-center leading-none">
              <span className="font-display text-lg font-semibold">{new Date(t.date).getDate()}</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                {new Date(t.date).toLocaleString("en-IN", { month: "short" })}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{t.name}</p>
              <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{className(t.classId)}</span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3" /> {t.questions} Qs
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" /> {t.duration} min
                </span>
              </p>
            </div>
            <Badge variant={statusVariant[t.status]}>
              {t.status === "Live" && <span className="mr-1.5 size-1.5 animate-pulse rounded-full bg-success" />}
              {t.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={`Actions for ${t.name}`}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast("Opening editor (prototype)")}>Edit</DropdownMenuItem>
                {t.status === "Draft" && (
                  <DropdownMenuItem onClick={() => setStatus(t.id, "Scheduled")}>Schedule</DropdownMenuItem>
                )}
                {t.status !== "Closed" && (
                  <DropdownMenuItem onClick={() => setStatus(t.id, "Closed")}>Close test</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl bg-card">
          <form onSubmit={create}>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Create a test</DialogTitle>
              <DialogDescription>Schedule a chapter test or full mock for a class.</DialogDescription>
            </DialogHeader>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="t-name">Test name</Label>
                <Input
                  id="t-name"
                  autoFocus
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Heredity — Ch. 9"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Class</Label>
                <Select value={form.classId} onValueChange={(v) => setForm({ ...form, classId: v })}>
                  <SelectTrigger>
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
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="t-date">Date</Label>
                  <Input id="t-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="t-q">Questions</Label>
                  <Input id="t-q" type="number" min={1} value={form.questions} onChange={(e) => setForm({ ...form, questions: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="t-d">Minutes</Label>
                  <Input id="t-d" type="number" min={5} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!form.name.trim()}>
                Schedule test
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
