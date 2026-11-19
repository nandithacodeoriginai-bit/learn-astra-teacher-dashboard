import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
const router = () => createRouter({ routeTree, context: { queryClient: new QueryClient() } });

describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    expect(router().matchRoutes("/").at(-1)?.routeId).not.toBe(rootRouteId);
  });

  // Each sidebar option opens its own page, not a section of the dashboard.
  const pages = ["/classes", "/performance", "/weak-topics", "/students", "/tests", "/content", "/doubts", "/export", "/profile"];
  it.each(pages)("%s is its own page", (path) => {
    expect(router().matchRoutes(path).at(-1)?.routeId).toBe(path);
  });
});
