import { useState } from "react";
import { FileText, SendHorizontal, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContentItem, ContentStatus, Track } from "@/lib/teacher-data";

const tabs: ContentStatus[] = ["Draft", "In review", "Published"];
const variant: Record<ContentStatus, "warning" | "soft" | "success"> = {
  Draft: "warning",
  "In review": "soft",
  Published: "success",
};
const kinds: ContentItem["kind"][] = ["Notes", "Paper", "Formula sheet"];
const tracks: Track[] = ["CBSE", "State", "ICSE", "KCET", "NEET"];

export function ContentManager({ initialItems }: { initialItems: ContentItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [tab, setTab] = useState<ContentStatus>("In review");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ title: string; kind: ContentItem["kind"]; track: Track; file: string }>({
    title: "",
    kind: "Notes",
    track: "NEET",
    file: "",
  });
  const shown = items.filter((i) => i.status === tab);

  const upload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setItems((list) => [
      { id: `c-${Date.now()}`, title: form.title.trim(), kind: form.kind, track: form.track, status: "Draft", updated: "Just now" },
      ...list,
    ]);
    setTab("Draft");
    setOpen(false);
    toast.success("Saved as draft", { description: "Submit it for review when it's ready." });
    setForm((f) => ({ ...f, title: "", file: "" }));
  };

  const submit = (id: string) => {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, status: "In review", updated: "Just now" } : i)));
    toast.success("Sent for review", { description: "An admin will approve it before students can see it." });
  };

  return (
    <section id="content" className="panel scroll-mt-6 p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Content manager</p>
          <h2 className="mt-1 text-2xl font-semibold">Notes & papers</h2>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Upload /> Upload
        </Button>
      </div>

      <div className="mt-5 flex rounded-full bg-background p-1">
        {tabs.map((t) => {
          const count = items.filter((i) => i.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "flex-1 whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-bold transition-colors " +
                (tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")
              }
            >
              {t} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-4 space-y-2">
        {shown.map((i) => (
          <li key={i.id} className="flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-background">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary">
              <FileText className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{i.title}</p>
              <p className="text-xs text-muted-foreground">
                {i.kind} · {i.track} · {i.updated}
              </p>
            </div>
            {i.status === "Draft" ? (
              <Button size="sm" variant="soft" onClick={() => submit(i.id)} aria-label={`Submit ${i.title} for review`}>
                <SendHorizontal /> Submit
              </Button>
            ) : (
              <Badge variant={variant[i.status]}>{i.status}</Badge>
            )}
          </li>
        ))}
        {shown.length === 0 && (
          <li className="py-8 text-center text-sm text-muted-foreground">Nothing here yet.</li>
        )}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl bg-card">
          <form onSubmit={upload}>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Upload content</DialogTitle>
              <DialogDescription>Notes, papers or formula sheets. New uploads start as drafts.</DialogDescription>
            </DialogHeader>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="c-title">Title</Label>
                <Input
                  id="c-title"
                  autoFocus
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Heredity — revision notes"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Type</Label>
                  <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v as ContentItem["kind"] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {kinds.map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Board / exam</Label>
                  <Select value={form.track} onValueChange={(v) => setForm({ ...form, track: v as Track })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tracks.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="c-file">File (PDF, Word or image)</Label>
                <Input
                  id="c-file"
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={(e) => setForm({ ...form, file: e.target.files?.[0]?.name ?? "" })}
                  className="bg-background"
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!form.title.trim()}>
                Save as draft
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
