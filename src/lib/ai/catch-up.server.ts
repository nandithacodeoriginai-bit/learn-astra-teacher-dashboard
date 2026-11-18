import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, NoObjectGeneratedError, Output, streamText } from "ai";
import { catchUpPlanSchema, describeStudent, tidyPlan, type CatchUpInput, type CatchUpResult } from "../catch-up";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

const INSTRUCTIONS = `You are an experienced Indian school and entrance-exam teacher coach (CBSE, ICSE, State boards for 10th; KCET and NEET for PU).
A teacher shares one student's progress. Recommend practical, personalised next steps that help this student catch up.

Rules:
- Base every point on the data and the teacher's notes. Do not invent facts about the student.
- summary: 2 sentences, plain words, where the student stands and the single biggest priority.
- likelyCauses: 2-3 short likely reasons for the gap, drawn from the data.
- steps: 4-5 concrete actions in order. Each has a short title (max 8 words), a detail (1-2 sentences naming the exact topic, number of questions or minutes), when (e.g. "Today", "This week", "Before next test"), and owner (Teacher, Student or Parent). Fit the student's weekly time.
- If the student has been inactive, the first step must re-engage them gently.
- messageToStudent: a warm, encouraging 2-3 sentence message the teacher can send, addressed to the student by first name. No blame.
- checkInGoal: one measurable target to check in 7 days.
Keep language simple enough for a busy teacher to act on in a minute.`;

export async function createCatchUpPlan(input: CatchUpInput, signal?: AbortSignal): Promise<CatchUpResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return { ok: false, message: "AI suggestions aren't set up yet. Please try again later." };

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  try {
    const result = streamText({
      model: provider.responses(MODEL),
      instructions: INSTRUCTIONS,
      messages: [{ role: "user", content: describeStudent(input) }],
      output: Output.object({ schema: catchUpPlanSchema }),
      maxRetries: 0,
      ...(signal ? { abortSignal: signal } : {}),
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const plan = await result.output;
    return { ok: true, plan: tidyPlan(plan) };
  } catch (error) {
    return { ok: false, message: explain(error) };
  }
}

function explain(error: unknown): string {
  if (NoObjectGeneratedError.isInstance(error)) {
    console.error("[catch-up] plan did not match schema", error.text?.slice(0, 500));
    return "The AI reply came back incomplete. Please try again.";
  }
  const status = APICallError.isInstance(error) ? error.statusCode : undefined;
  console.error("[catch-up] gateway error", status, error instanceof Error ? error.message : error);
  if (status === 402) return "AI credits for this workspace have run out. Add credits to keep getting suggestions.";
  if (status === 429) return "Lots of requests right now. Please wait a moment and try again.";
  if (status === 403) return "AI suggestions are switched off for this workspace. Ask your workspace admin.";
  if (status === 400) return "Some details couldn't be read. Check the form and try again.";
  return "Couldn't get suggestions right now. Please try again.";
}
