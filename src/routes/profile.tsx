import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/dashboard/PageShell";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/profile")({
  head: () => pageHead("Profile & Settings", "Your lecturer profile and notification preferences."),
  component: ProfilePage,
});

const alerts = [
  { id: "doubts", label: "New student doubts", hint: "Get a note when a student asks something." },
  { id: "inactive", label: "Inactive students", hint: "When a student hasn't practised for over 7 days." },
  { id: "review", label: "Content review updates", hint: "When an admin approves or returns your upload." },
];

function ProfilePage() {
  const [form, setForm] = useState({ name: "Sneha Rao", email: "sneha.rao@learnastra.in", subject: "Biology · Science" });
  const [on, setOn] = useState<Record<string, boolean>>({ doubts: true, inactive: true, review: false });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile saved");
  };

  return (
    <>
      <PageHeader eyebrow="Profile / settings" title="Your profile" />
      <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <form onSubmit={save} className="panel space-y-4 p-6">
          <h2 className="text-xl font-semibold">Details</h2>
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Name</Label>
            <Input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-background" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-email">Email</Label>
            <Input id="p-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-background" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-subject">Subjects</Label>
            <Input id="p-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="bg-background" />
          </div>
          <Button type="submit">Save changes</Button>
        </form>

        <section className="panel p-6">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <ul className="mt-4 divide-y divide-border">
            {alerts.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <Label htmlFor={`n-${a.id}`} className="text-sm font-semibold">
                    {a.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{a.hint}</p>
                </div>
                <Switch id={`n-${a.id}`} checked={!!on[a.id]} onCheckedChange={(v) => setOn({ ...on, [a.id]: v })} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
