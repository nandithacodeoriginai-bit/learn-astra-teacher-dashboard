import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  classes,
  contentItems as initialContent,
  doubts as initialDoubts,
  managedTests,
  studentsByClass,
  testsByClass,
  weakTopicsByClass,
  type ContentItem,
  type Doubt,
  type ManagedTest,
} from "@/lib/teacher-data";

// Prototype state shared by every dashboard page, so changes survive moving between pages
// (they still reset on a full reload).
type TeacherState = {
  classId: string;
  setClassId: (id: string) => void;
  tests: ManagedTest[];
  setTests: (tests: ManagedTest[]) => void;
  content: ContentItem[];
  setContent: (items: ContentItem[]) => void;
  doubts: Doubt[];
  answered: number;
  answerDoubt: (id: string) => void;
  addRevisionTest: () => ManagedTest;
};

const TeacherContext = createContext<TeacherState | null>(null);

export function TeacherProvider({ children }: { children: ReactNode }) {
  const [classId, setClassId] = useState("neet-b");
  const [tests, setTests] = useState<ManagedTest[]>(managedTests);
  const [content, setContent] = useState<ContentItem[]>(initialContent);
  const [doubts, setDoubts] = useState<Doubt[]>(initialDoubts);
  const [answered, setAnswered] = useState(0);

  const value = useMemo<TeacherState>(
    () => ({
      classId,
      setClassId,
      tests,
      setTests,
      content,
      setContent,
      doubts,
      answered,
      answerDoubt: (id) => {
        setDoubts((d) => d.filter((x) => x.id !== id));
        setAnswered((n) => n + 1);
      },
      addRevisionTest: () => {
        const cls = classes.find((c) => c.id === classId);
        const weakest = weakTopicsByClass[classId]?.[0]?.topic;
        const test: ManagedTest = {
          id: `rev-${Date.now()}`,
          name: `Revision: ${weakest ?? cls?.name ?? "class"}`,
          classId,
          date: "2026-11-23",
          questions: 20,
          duration: 30,
          status: "Draft",
        };
        setTests((t) => [test, ...t]);
        return test;
      },
    }),
    [classId, tests, content, doubts, answered],
  );

  return <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>;
}

export function useTeacher() {
  const ctx = useContext(TeacherContext);
  if (!ctx) throw new Error("useTeacher must be used inside TeacherProvider");
  return ctx;
}

/** The selected class plus its students, test results and weak topics. */
export function useCurrentClass() {
  const { classId } = useTeacher();
  const cls = classes.find((c) => c.id === classId) ?? classes[0]!;
  return {
    cls,
    students: studentsByClass[cls.id] ?? [],
    results: testsByClass[cls.id] ?? [],
    weak: weakTopicsByClass[cls.id] ?? [],
  };
}
