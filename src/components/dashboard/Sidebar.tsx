import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  BookOpenText,
  Menu,
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


function NavList({ openDoubts }: { openDoubts: number }) {
  return (
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
                <item.icon className="size-4 shrink-0" />
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
  );
}

function Brand() {
  return (
    <Link to="/" className="relative flex items-center gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
        <Sparkles className="size-5" />
      </div>
      <div>
        <p className="font-display text-xl leading-none font-semibold">LearnAstra</p>
        <p className="mt-1 text-[11px] tracking-[0.16em] uppercase text-sidebar-foreground/55">Lecturer</p>
      </div>
    </Link>
  );
}

function ProfileRow() {
  return (
    <div className="relative flex items-center gap-3 border-t border-sidebar-border px-6 py-4">
      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-primary font-display text-sm font-semibold text-sidebar-primary-foreground">
        SR
      </div>
      <div className="min-w-0 flex-1 text-sm">
        <p className="truncate font-semibold leading-tight">Sneha Rao</p>
        <p className="truncate text-xs text-sidebar-foreground/55">Biology · Science</p>
      </div>
      <Link to="/profile" aria-label="Profile and settings">
        <Settings className="size-4 text-sidebar-foreground/60 hover:text-sidebar-foreground" />
      </Link>
    </div>
  );
}

/** Fixed menu on laptops and desktops. */
export function Sidebar({ openDoubts }: { openDoubts: number }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex" data-print-hide>
      <div className="grain absolute inset-0 pointer-events-none opacity-60" />
      <div className="px-6 pt-7 pb-6">
        <Brand />
      </div>
      <NavList openDoubts={openDoubts} />
      <ProfileRow />
    </aside>
  );
}

/** Top bar with a slide-out menu on phones and tablets. */
export function MobileNav({ openDoubts }: { openDoubts: number }) {
  const [open, setOpen] = useState(false);
  const pathname = useLocation({ select: (l) => l.pathname });
  useEffect(() => setOpen(false), [pathname]);
  const current = navGroups.flatMap((g) => g.items).find((i) => i.to === pathname);

  return (
    <div
      className="sticky top-0 z-30 -mx-5 -mt-6 mb-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-sidebar px-5 py-3 text-sidebar-foreground md:-mx-10 md:-mt-8 md:px-10 lg:hidden"
      data-print-hide
    >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="relative grid size-10 place-items-center rounded-xl bg-sidebar-accent"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
            {openDoubts > 0 && (
              <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-sidebar-primary text-[10px] font-bold text-sidebar-primary-foreground">
                {openDoubts}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex w-72 flex-col gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="px-6 pt-6 pb-6">
            <Brand />
          </div>
          <NavList openDoubts={openDoubts} />
          <ProfileRow />
        </SheetContent>
      </Sheet>
      <div className="min-w-0">
        <p className="font-display text-lg leading-none font-semibold">LearnAstra</p>
        {current && <p className="mt-1 truncate text-xs text-sidebar-foreground/60">{current.label}</p>}
      </div>
      <Link
        to="/profile"
        className="grid size-9 place-items-center rounded-full bg-sidebar-primary font-display text-xs font-semibold text-sidebar-primary-foreground"
        aria-label="Profile and settings"
      >
        SR
      </Link>
    </div>
  );
}
