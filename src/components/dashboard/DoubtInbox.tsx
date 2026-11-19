import { useState } from "react";
import { Camera, CheckCircle2, MessageSquareReply, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Doubt } from "@/lib/teacher-data";

export function DoubtInbox({
  doubts,
  answered,
  onAnswer,
}: {
  doubts: Doubt[];
  answered: number;
  onAnswer: (id: string) => void;
}) {
  const [current, setCurrent] = useState<Doubt | null>(null);
  const [reply, setReply] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || !reply.trim()) return;
    onAnswer(current.id);
    toast.success(`Answer sent to ${current.student}`, { description: "It also appears in the class doubt forum." });
    setCurrent(null);
    setReply("");
  };

  return (
    <section id="doubts" className="panel scroll-mt-6 flex flex-col p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Doubt inbox</p>
          <h2 className="mt-1 text-2xl font-semibold">Unanswered</h2>
          {answered > 0 && <p className="mt-1 text-xs text-success">{answered} answered today</p>}
        </div>
        <span className="font-display text-4xl font-semibold">{doubts.length}</span>
      </div>

      {doubts.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <CheckCircle2 className="size-8 text-success" />
          <p className="mt-3 font-display text-lg">Inbox clear</p>
          <p className="text-sm text-muted-foreground">Every doubt has an answer.</p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {doubts.map((d) => (
            <li key={d.id} className="rounded-2xl bg-background p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{d.student}</span>
                <span>{d.ago}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {d.className} · {d.topic}
              </p>
              <p className="mt-2 text-sm leading-snug">{d.question}</p>
              <div className="mt-3 flex items-center justify-between">
                {d.hasPhoto ? (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Camera className="size-3.5" /> Photo attached
                  </span>
                ) : (
                  <span />
                )}
                <Button size="sm" onClick={() => setCurrent(d)}>
                  <MessageSquareReply /> Answer
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!current} onOpenChange={(o) => !o && setCurrent(null)}>
        <DialogContent className="rounded-3xl bg-card">
          {current && (
            <form onSubmit={send}>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Answer {current.student}</DialogTitle>
                <DialogDescription>
                  {current.className} · {current.topic}
                </DialogDescription>
              </DialogHeader>
              <blockquote className="mt-4 rounded-2xl bg-background p-4 text-sm leading-relaxed">
                {current.question}
                {current.hasPhoto && (
                  <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Camera className="size-3.5" /> Student attached a photo
                  </span>
                )}
              </blockquote>
              <Textarea
                autoFocus
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a clear, step-by-step answer…"
                className="mt-4 min-h-32 bg-background"
                aria-label="Your answer"
              />
              <DialogFooter className="mt-5">
                <Button type="button" variant="ghost" onClick={() => setCurrent(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!reply.trim()}>
                  <Send /> Send answer
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
