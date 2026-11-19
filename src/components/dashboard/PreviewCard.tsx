import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { PagePath } from "@/components/dashboard/Sidebar";
import { ArrowRight } from "lucide-react";

export function PreviewCard({
  title,
  to,
  linkLabel = "View all",
  ink,
  className = "",
  children,
}: {
  title: string;
  to: PagePath;
  linkLabel?: string;
  ink?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={(ink ? "panel-ink relative overflow-hidden " : "panel ") + "flex flex-col p-6 " + className}>
      {ink && <div className="grain pointer-events-none absolute inset-0" />}
      <div className="relative flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link
          to={to}
          className={
            "flex items-center gap-1 text-xs font-bold underline-offset-4 hover:underline " +
            (ink ? "text-primary-foreground/80" : "text-foreground/80")
          }
        >
          {linkLabel} <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="relative mt-5 flex-1">{children}</div>
    </section>
  );
}
