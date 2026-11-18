import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Notice } from "@/lib/teacher-data";

export function Notifications({ items }: { items: Notice[] }) {
  const [unread, setUnread] = useState<Set<string>>(() => new Set(items.map((i) => i.id)));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative size-10 bg-card"
          aria-label={unread.size ? `Notifications, ${unread.size} unread` : "Notifications"}
        >
          <Bell />
          {unread.size > 0 && (
            <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unread.size}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-3xl bg-card p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="font-display text-lg font-semibold">Notifications</p>
          <button
            className="text-xs font-bold underline-offset-4 hover:underline disabled:opacity-40"
            disabled={unread.size === 0}
            onClick={() => setUnread(new Set())}
          >
            Mark all read
          </button>
        </div>
        <ul className="max-h-96 overflow-y-auto p-2">
          {items.map((n) => {
            const isUnread = unread.has(n.id);
            return (
              <li key={n.id}>
                <button
                  onClick={() =>
                    setUnread((s) => {
                      const next = new Set(s);
                      next.delete(n.id);
                      return next;
                    })
                  }
                  className="flex w-full gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-background"
                >
                  <span className={"mt-1.5 size-2 shrink-0 rounded-full " + (isUnread ? "bg-destructive" : "bg-transparent")} />
                  <span className="min-w-0 flex-1">
                    <span className={"block text-sm " + (isUnread ? "font-bold" : "font-medium")}>{n.title}</span>
                    <span className="block text-xs text-muted-foreground">{n.body}</span>
                    <span className="mt-1 block text-[11px] text-muted-foreground">{n.ago}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
