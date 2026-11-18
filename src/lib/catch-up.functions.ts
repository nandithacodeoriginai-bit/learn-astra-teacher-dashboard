import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { catchUpInputSchema } from "./catch-up";
import { createCatchUpPlan } from "./ai/catch-up.server";

export const getCatchUpPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => catchUpInputSchema.parse(input))
  .handler(async ({ data }) => createCatchUpPlan(data, getRequest()?.signal));
