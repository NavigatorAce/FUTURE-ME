# Branch Self — Implementation Plan (from dependency audit)

## 1. Audit verification (confirmed)

| Item | Result |
|------|--------|
| **openai** | Only `src/lib/openai/client.ts` imports it; no route or service uses it. **Unused.** |
| **@radix-ui/react-dialog, react-tabs** | No imports in `src/`. **Unused.** |
| **lucide-react** | No imports in `src/`. **Unused.** |
| **/api/ask** | Uses `generateAnswerForBranch` from `services/ai.ts`; that module only returns mock data. **Still mock-based.** |
| **Gemini** | Only used in `src/app/api/chat/route.ts` (and `lib/gemini/*`). **Correct.** |

---

## 2. Implementation phases (priority order)

1. **Phase 1 — Zod + request validation**  
   - Add `zod`.  
   - Add request body validation for `POST /api/profile`, `POST /api/ask`, `POST /api/chat`.  
   - No UI or product changes.

2. **Phase 2 — Multi-profile**  
   - DB/RLS: support multiple profiles per user (e.g. new table or `user_id` + profile name/slug).  
   - API: list profiles, create profile, select default; keep existing profile API semantics where possible.

3. **Phase 3 — /ask profile selection**  
   - On `/ask`, allow user to choose which profile to use (dropdown or similar).  
   - Pass selected profile (or default) to existing ask/chat flow. Minimal UI.

4. **Phase 4 — Rate limiting**  
   - Add simple rate limit (in-memory or Upstash) on key routes (e.g. `/api/chat`, `/api/ask`, `/api/profile` POST).

5. **Phase 5 — Logging (optional)**  
   - Structured logging / audit for sensitive actions; optional pino or light wrapper.

6. **Phase 6 — Dependency cleanup**  
   - Remove: `openai`, `@radix-ui/react-dialog`, `@radix-ui/react-tabs`, `lucide-react` if still unused.  
   - Optionally align `@types/react` / `@types/react-dom` to ^18.

7. **Phase 7 — README / env docs**  
   - Document Gemini (not OpenAI), `GEMINI_API_KEY`, and optional `npm install --legacy-peer-deps` reason.

---

## 3. Files to change first (Phase 1 — Zod)

| Step | File | Action |
|------|------|--------|
| 1 | `package.json` | Add dependency: `zod`. |
| 2 | `src/lib/validations/schemas.ts` (new) | Define Zod schemas for profile POST, ask POST, chat POST. |
| 3 | `src/app/api/profile/route.ts` | Parse JSON, run profile schema, return 400 on failure, then existing logic. |
| 4 | `src/app/api/ask/route.ts` | Parse JSON, run ask schema, return 400 on failure, then existing logic. |
| 5 | `src/app/api/chat/route.ts` | Parse JSON, run chat schema, return 400 on failure, then existing logic. |

No new env validation in Phase 1 (optional later).

---

## 4. Smallest safe dependency change for MVP

- **Install now:** `zod` only.  
- **Postpone:** react-hook-form, @hookform/resolvers, @upstash/ratelimit, pino, Supabase helpers.  
- **@types/react ^18:** Fix when convenient; not required for zod. Removes need for `--legacy-peer-deps` after downgrade.  
- **After @types downgrade:** You can run `npm install` without `--legacy-peer-deps` if no other peer conflicts.

---

## 5. Actionable summary

- **A. What the codebase already has**  
  Next 14, React 18, Tailwind, shadcn-style (CVA + Radix Slot/Label), Supabase Auth + DB + RLS, Gemini in `/api/chat`, mock-based `/api/ask`, single-profile flow, `/api/profile`, `/api/sessions`, `/api/branches`, `/api/auth/login`.

- **B. What is missing**  
  Request validation (zod), multi-profile model/API, profile selection on /ask, rate limiting, optional audit logging, dependency cleanup, README/env alignment with Gemini.

- **C. What to install now**  
  `zod` only.

- **D. What files to modify first**  
  `package.json` (add zod), new `src/lib/validations/schemas.ts`, then `src/app/api/profile/route.ts`, `src/app/api/ask/route.ts`, `src/app/api/chat/route.ts`.

- **E. Risks to watch**  
  Invalid or oversized JSON bodies could throw before zod; wrap `request.json()` in try/catch and return 400. Zod errors: return 400 with a clear message, avoid leaking internal schema. Keep existing auth and Supabase checks as-is.

- **F. What can be removed later**  
  `openai`, `@radix-ui/react-dialog`, `@radix-ui/react-tabs`, `lucide-react` (if still unused). Optionally downgrade `@types/react` and `@types/react-dom` to ^18.

---

## Phase 1 status (Zod + validation)

- **Done:** `zod` installed; `src/lib/validations/schemas.ts` added; `POST /api/profile`, `POST /api/ask`, `POST /api/chat` validate body with zod and return 400 on invalid JSON or schema failure.
- **Next:** Phase 2 (multi-profile) when ready.
