import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageShell";
import { DoubtInbox } from "@/components/dashboard/DoubtInbox";
import { useTeacher } from "@/lib/teacher-store";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/doubts")({
  head: () => pageHead("Doubt Inbox", "Read and answer students' doubts, with photos they attached."),
  component: DoubtsPage,
});

function DoubtsPage() {
  const { doubts, answered, answerDoubt } = useTeacher();
  return (
    <>
      <PageHeader eyebrow="Doubt inbox" title="Student doubts" description="Answers also appear in the class doubt forum." />
      <div className="max-w-3xl">
        <DoubtInbox doubts={doubts} answered={answered} onAnswer={answerDoubt} />
      </div>
    </>
  );
}
