# Branch Self — Project Structure

## Folder structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/login/       # Sign in / Sign up
│   ├── api/                # API routes
│   │   ├── auth/login/     # Supabase auth
│   │   ├── profile/        # POST save profile + generate branches
│   │   ├── branches/       # GET user's branches
│   │   ├── ask/            # POST question → create session + generate answers
│   │   └── sessions/       # GET list, GET [sessionId] with answers
│   ├── branches/           # Future branches page
│   ├── profile/            # Current self profile / onboarding
│   ├── ask/                # Ask one question
│   ├── results/[sessionId]/ # Results: question + 3 answers
│   ├── history/            # Past sessions
│   ├── layout.tsx
│   ├── page.tsx            # Landing
│   └── globals.css
├── components/
│   ├── layout/
│   │   └── AppNav.tsx      # Top nav
│   └── ui/                 # Reusable (shadcn-style)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── textarea.tsx
├── lib/
│   ├── supabase/           # Browser + server clients, middleware
│   ├── openai/              # Client + prompts
│   ├── utils/               # cn(), etc.
│   └── mock-store.ts       # In-memory store when Supabase not configured
├── services/                # Business logic
│   ├── profile.ts          # Profile CRUD
│   ├── branches.ts          # Branches CRUD
│   ├── dialogue.ts         # Sessions + answers CRUD
│   └── ai.ts               # generateBranches, generateAnswerForBranch
└── types/
    ├── index.ts             # Domain types (profile, branches, sessions, answers)
    └── database.types.ts    # Supabase DB types (minimal hand-written)

supabase/
└── migrations/
    └── 001_initial_schema.sql   # profiles, future_branches, dialogue_sessions, branch_answers, RLS
```

## What is mocked vs wired

| Feature | Without env | With Supabase + OpenAI |
|--------|-------------|-------------------------|
| Auth | Login redirects to /profile; no real auth | Supabase sign in / sign up |
| Profile | Stored in memory (lost on restart) | Stored in `profiles` table |
| Branches | Generated via OpenAI or mock personas; stored in memory | Stored in `future_branches` |
| Ask / Answers | OpenAI or mock answers; session in memory | Sessions in `dialogue_sessions`, answers in `branch_answers` |
| History | In-memory sessions | Fetched from DB |

- **Mock mode**: No `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` → all data in `mockStore` (server memory).
- **OpenAI**: No `OPENAI_API_KEY` (or placeholder) → `services/ai.ts` uses fixed mock branches and mock answers.

## TODO markers

- **Supabase**: In `src/lib/supabase/client.ts` and `server.ts`: add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` and run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor.
- **OpenAI**: In `src/lib/openai/client.ts`: add `OPENAI_API_KEY` to `.env.local` for real branch and answer generation.
- **Auth**: Login page uses `/api/auth/login` when Supabase is configured; otherwise it simulates success and redirects to `/profile`.

## Run locally

```bash
cp .env.example .env.local
# Edit .env.local if you have Supabase / OpenAI keys
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Without any keys, you can still complete the flow with mock data and mock AI responses.
