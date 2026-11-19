import { Link } from "@tanstack/react-router";
import {
  BookOpenText,
  ClipboardList,
  Download,
  LayoutGrid,
  LineChart,
  MessageCircleQuestion,
  School,
  Settings,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

export type PagePath =
  | "/"
  | "/classes"
  | "/performance"
  | "/weak-topics"
  | "/students"
  | "/tests"
  | "/content"
  | "/doubts"
  | "/export"
  | "/profile";

type NavItem = { label: string; to: PagePath; icon: React.ComponentType<{ className?: string }> };

export const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Teaching",
    items: [
      { label: "Dashboard", to: "/", icon: LayoutGrid },
      { label: "My Classes", to: "/classes", icon: School },
      { label: "Class Performance", to: "/performance", icon: LineChart },
      { label: "Weak Topics", to: "/weak-topics", icon: Target },
      { label: "Student List", to: "/students", icon: Users },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Test Manager", to: "/tests", icon: ClipboardList },
      { label: "Content Manager", to: "/content", icon: BookOpenText },
      { label: "Doubt Inbox", to: "/doubts", icon: MessageCircleQuestion },
      { label: "Export Results", to: "/export", icon: Download },
      { label: "Profile / Settings", to: "/profile", icon: Settings },
    ],
  },
];

const allItems = navGroups.flatMap((g) => g.items);

export function Sidebar({ openDoubts }: { openDoubts: number }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex" data-print-hide>
      <div className="grain absolute inset-0 pointer-events-none opacity-60" />
      <Link to="/" className="relative flex items-center gap-3 px-6 pt-7 pb-6">
        <div className="grid size-10 place-items-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Sparkles className="size-5" />
        </div>
        <div>
          <p className="font-display text-xl leading-none font-semibold">LearnAstra</p>
          <p className="mt-1 text-[11px] tracking-[0.16em] uppercase text-sidebar-foreground/55">Lecturer</p>
        </div>
      </Link>

      <nav className="relative flex-1 space-y-6 overflow-y-auto px-3">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[11px] font-bold tracking-[0.16em] uppercase text-sidebar-foreground/45">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: true }}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
                  activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground" }}
                  inactiveProps={{
                    className: "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  }}
                >
                  <item.icon className="size-4" />
                  <span className="flex-1">{item.label}</span>
                  {item.to === "/doubts" && openDoubts > 0 && (
                    <span className="rounded-full bg-sidebar-primary px-2 py-0.5 text-[11px] font-bold text-sidebar-primary-foreground group-data-[status=active]:bg-sidebar group-data-[status=active]:text-sidebar-foreground">
                      {openDoubts}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative flex items-center gap-3 border-t border-sidebar-border px-6 py-4">
        <div className="grid size-9 place-items-center rounded-full bg-sidebar-primary font-display text-sm font-semibold text-sidebar-primary-foreground">
          SR
        </div>
        <div className="flex-1 text-sm">
          <p className="font-semibold leading-tight">Sneha Rao</p>
          <p className="text-xs text-sidebar-foreground/55">Biology · Science</p>
        </div>
        <Link to="/profile" aria-label="Profile and settings">
          <Settings className="size-4 text-sidebar-foreground/60 hover:text-sidebar-foreground" />
        </Link>
      </div>
    </aside>
  );
}

export function MobileNav({ openDoubts }: { openDoubts: number }) {
  return (
    <div className="-mx-5 -mt-6 mb-6 bg-sidebar px-5 pt-5 pb-3 text-sidebar-foreground md:-mx-10 md:-mt-8 md:px-10 lg:hidden" data-print-hide>
      <div className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Sparkles className="size-4" />
        </div>
        <p className="font-display text-lg font-semibold">LearnAstra</p>
        <Link
          to="/profile"
          className="ml-auto grid size-8 place-items-center rounded-full bg-sidebar-primary font-display text-xs font-semibold text-sidebar-primary-foreground"
          aria-label="Profile and settings"
        >
          SR
        </Link>
      </div>
      <nav className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 md:-mx-10 md:px-10">
        {allItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: true }}
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
            activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground" }}
            inactiveProps={{ className: "bg-sidebar-accent text-sidebar-foreground/80" }}
          >
            <item.icon className="size-3.5" />
            {item.label}
            {item.to === "/doubts" && openDoubts > 0 && <span className="opacity-70">{openDoubts}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
