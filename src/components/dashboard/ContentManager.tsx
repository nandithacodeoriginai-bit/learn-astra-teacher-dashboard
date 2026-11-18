import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ContentItem, ContentStatus } from "@/lib/teacher-data";

const tabs: ContentStatus[] = ["Draft", "In review", "Published"];
const variant: Record<ContentStatus, "warning" | "soft" | "success"> = {
  Draft: "warning",
  "In review": "soft",
  Published: "success",
};

export function ContentManager({ items }: { items: ContentItem[] }) {
  const [tab, setTab] = useState<ContentStatus>("In review");
  const shown = items.filter((i) => i.status === tab);

  return (
    <section id="content" className="panel scroll-mt-6 p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Content manager</p>
          <h2 className="mt-1 text-2xl font-semibold">Notes & papers</h2>
        </div>
        <Button
          variant="soft"
          size="icon"
          aria-label="Upload content"
          onClick={() => toast("Upload notes or papers", { description: "PDF, DOCX or images (prototype)." })}
        >
          <Upload />
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
                "flex-1 rounded-full px-2 py-1.5 text-xs font-bold transition-colors " +
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
            <Badge variant={variant[i.status]}>{i.status}</Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
