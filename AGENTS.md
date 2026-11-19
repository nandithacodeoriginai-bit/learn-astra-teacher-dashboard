<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Teacher dashboard is a frontend prototype: mock data lives in `src/lib/teacher-data.ts` with a fixed TODAY date so server and browser renders match.
- Dashboard widgets live in `src/components/dashboard/`, one file per widget group; each sidebar option is its own route file, and `/` is an overview of preview cards linking to them. Prototype state shared across pages (selected class, tests, content, doubts) lives in `TeacherProvider` (`src/lib/teacher-store.tsx`), mounted once in the root shell. Why: pages must keep edits while the teacher moves between them.
- AI calls go through Lovable AI Gateway from server-only `src/lib/ai/*.server.ts`, exposed to the UI via `*.functions.ts` server functions; shared zod schemas live in client-safe `src/lib/*.ts`. Why: keeps the key and prompts off the browser while the form and server validate the same shape.
