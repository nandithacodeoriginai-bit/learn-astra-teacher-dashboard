import {
  BookOpenText,
  ClipboardList,
  Download,
  LayoutGrid,
  LineChart,
  MessageCircleQuestion,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

const nav = [
  { label: "Overview", href: "#overview", icon: LayoutGrid },
  { label: "Class performance", href: "#performance", icon: LineChart },
  { label: "Students", href: "#students", icon: Users },
  { label: "Test manager", href: "#tests", icon: ClipboardList },
  { label: "Content", href: "#content", icon: BookOpenText },
  { label: "Doubt inbox", href: "#doubts", icon: MessageCircleQuestion },
  { label: "Export", href: "#export", icon: Download },
];

export function Sidebar({ active, openDoubts }: { active: string; openDoubts: number }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
      <div className="grain absolute inset-0 pointer-events-none opacity-60" />
      <div className="relative flex items-center gap-3 px-6 pt-7 pb-8">
        <div className="grid size-10 place-items-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Sparkles className="size-5" />
        </div>
        <div>
          <p className="font-display text-xl leading-none font-semibold">LearnAstra</p>
          <p className="mt-1 text-[11px] tracking-[0.16em] uppercase text-sidebar-foreground/55">
            Lecturer
          </p>
        </div>
      </div>

      <nav className="relative flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const isActive = active === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors " +
                (isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground")
              }
            >
              <item.icon className="size-4" />
              <span className="flex-1">{item.label}</span>
              {item.href === "#doubts" && openDoubts > 0 && (
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-[11px] font-bold " +
                    (isActive
                      ? "bg-sidebar text-sidebar-foreground"
                      : "bg-sidebar-primary text-sidebar-primary-foreground")
                  }
                >
                  {openDoubts}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      <div className="relative m-3 rounded-2xl border border-sidebar-border bg-sidebar-accent p-4">
        <p className="font-display text-lg leading-tight">Revision week</p>
        <p className="mt-1 text-xs text-sidebar-foreground/65">
          NEET Batch B has 3 topics below 50% accuracy.
        </p>
        <a
          href="#performance"
          className="mt-3 inline-block text-xs font-bold underline underline-offset-4"
        >
          Plan revision →
        </a>
      </div>

      <div className="relative flex items-center gap-3 border-t border-sidebar-border px-6 py-4">
        <div className="grid size-9 place-items-center rounded-full bg-sidebar-primary font-display text-sm font-semibold text-sidebar-primary-foreground">
          SR
        </div>
        <div className="flex-1 text-sm">
          <p className="font-semibold leading-tight">Sneha Rao</p>
          <p className="text-xs text-sidebar-foreground/55">Biology · Science</p>
        </div>
        <Settings className="size-4 text-sidebar-foreground/60" />
      </div>
    </aside>
  );
}

export function MobileNav({ active, openDoubts }: { active: string; openDoubts: number }) {
  return (
    <div className="-mx-5 -mt-6 mb-6 bg-sidebar px-5 pt-5 pb-3 text-sidebar-foreground md:-mx-10 md:-mt-8 md:px-10 lg:hidden" data-print-hide>
      <div className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Sparkles className="size-4" />
        </div>
        <p className="font-display text-lg font-semibold">LearnAstra</p>
        <span className="ml-auto grid size-8 place-items-center rounded-full bg-sidebar-primary font-display text-xs font-semibold text-sidebar-primary-foreground">
          SR
        </span>
      </div>
      <nav className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 md:-mx-10 md:px-10">
        {nav.map((item) => {
          const isActive = active === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold " +
                (isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "bg-sidebar-accent text-sidebar-foreground/80")
              }
            >
              <item.icon className="size-3.5" />
              {item.label}
              {item.href === "#doubts" && openDoubts > 0 && <span className="opacity-70">{openDoubts}</span>}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
