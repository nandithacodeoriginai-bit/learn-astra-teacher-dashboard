import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageShell";
import { ContentManager } from "@/components/dashboard/ContentManager";
import { useTeacher } from "@/lib/teacher-store";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/content")({
  head: () => pageHead("Content Manager", "Upload notes and papers and send them to admin for review."),
  component: ContentPage,
});

function ContentPage() {
  const { content, setContent } = useTeacher();
  return (
    <>
      <PageHeader
        eyebrow="Content manager"
        title="Notes & papers"
        description="Upload study material. Drafts go to an admin for review before students can see them."
      />
      <div className="max-w-3xl">
        <ContentManager items={content} onChange={setContent} />
      </div>
    </>
  );
}
