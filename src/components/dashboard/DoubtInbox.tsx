import { Camera, CheckCircle2, MessageSquareReply } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Doubt } from "@/lib/teacher-data";

export function DoubtInbox({ doubts, onAnswer }: { doubts: Doubt[]; onAnswer: (id: string) => void }) {
  return (
    <section id="doubts" className="panel scroll-mt-6 flex flex-col p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Doubt inbox</p>
          <h2 className="mt-1 text-2xl font-semibold">Unanswered</h2>
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
                <Button
                  size="sm"
                  onClick={() => {
                    onAnswer(d.id);
                    toast.success(`Answer sent to ${d.student}`);
                  }}
                >
                  <MessageSquareReply /> Answer
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
