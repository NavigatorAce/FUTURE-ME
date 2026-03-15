# Future Me

**Talk to your future self — 5, 10, or 15 years from now.**

---

## One-Sentence Pitch

Future Me lets you create a profile of who you are right now, then chat with a future version of yourself. Your personality, goals, fears, and struggles all shape the conversation, so every response feels personal and emotionally honest.

---

## Overview

Future Me is not a fortune teller. It's a **reflective AI product** that helps you think through uncertainty by chatting with a future version of yourself. You define your current self (age, life stage, personality, goals, fears, struggles), choose a time horizon (5, 10, or 15 years ahead), and start a multi-turn conversation with "Future Me." The result is self-exploration, decision support, and emotional companionship — all tailored to who you actually are.

---

## Problem

- **Uncertainty and anxiety** — People struggle with major life decisions and fear of the unknown.
- **Passive journaling** — Writing alone often doesn't surface new perspectives or "what if" scenarios.
- **Generic AI chat** — Standard chatbots feel impersonal and don't reflect *your* story or possible futures.
- **Craving resonance** — People want advice that feels personal, emotionally honest, and tied to their own path.

---

## Solution

Future Me turns "what might I become?" into a concrete, interactive conversation:

1. **Current Self Profile** — You build a short profile: age, life stage, personality traits, goals, fears, and current struggles.
2. **Choose Your Time Horizon** — Pick 5, 10, or 15 years ahead to talk to a different "age" of your future self.
3. **Chat with Future Me** — Have a real-time, multi-turn conversation. Ask anything — career choices, relationship doubts, life transitions — and get answers that reflect *your* context.
4. **Personality-driven voice** — Future Me speaks in a style shaped by your personality traits. If you're creative, the answers are vivid and metaphorical. If you're practical, they're direct and concrete.

The product does **not** predict the future. It supports **self-reflection**, **decision support**, and **exploration of your possible life path**.

---

## Core Features

| Feature | Description |
|--------|-------------|
| **Current Self Profile** | Capture age, life stage, personality traits, goals, fears, struggles, and additional context. Data persists in the database and can be updated anytime. |
| **Time Horizon Selection** | Choose to talk to yourself 5, 10, or 15 years from now. Switching resets the conversation. |
| **Multi-turn Chat** | Real-time conversational interface with your future self. Full conversation history is maintained per session. |
| **Personality-driven Voice** | Future Me adapts its speaking style based on your personality traits — warm, practical, creative, anxious, optimistic, etc. |
| **Profile Persistence** | Profile data is saved to the database. Revisiting the profile page loads your existing data for easy updates. |
| **Conversation History** | View past chat sessions and revisit previous questions. |

---

## How It Works

1. **Sign up / Log in** — Create an account via Supabase auth.
2. **Fill out your profile** — Age, life stage, personality traits, goals, fears, current struggles, and optionally anything else you want your future self to know.
3. **Start chatting** — Choose a time horizon (5 / 10 / 15 years) and type your question. Future Me responds in character, drawing on your profile.
4. **Multi-turn dialogue** — Continue the conversation. Future Me remembers what you've said in the current session.
5. **Reflect** — Read Future Me's responses to inform your thinking. These are not predictions — they're reflective perspectives grounded in who you are.

---

## Why It's Different

| Alternative | How Future Me Differs |
|-------------|----------------------|
| **Generic chatbots** | Advice is tied to *your* profile and personality, not one-size-fits-all. |
| **Journaling apps** | You get active dialogue with a future version of yourself, not just your current self writing. |
| **Personality tests** | Focus is on exploring your *future* through conversation, not static labels. |
| **Fortune-telling / prediction** | We don't claim to predict the future; we help you explore and reflect on possible paths. |

---

## Example Use Cases

- **Career choice** — "Should I take the job in another city or stay where I am?"
- **Relationship uncertainty** — "Will I regret not reaching out to them?"
- **Burnout / self-growth** — "Does the anxiety get better? What actually helped?"
- **Big life transitions** — Marriage, parenthood, retirement — talk through the what-ifs with your future self.
- **Daily reflection** — "What do you wish we'd done differently at this age?"

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui-style components |
| **Auth & DB** | Supabase (auth + PostgreSQL); optional for MVP (in-memory mock) |
| **AI / LLM** | Google Gemini API (gemini-3-flash-preview) via `@google/generative-ai` SDK |
| **Validation** | Zod for API input validation |
| **Deployment** | Vercel-ready (Next.js App Router) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- (Optional) Supabase project for auth and database
- (Optional) Google Gemini API key for real AI responses

### Setup

```bash
# Clone the repository
git clone https://github.com/NavigatorAce/FUTURE-ME.git
cd FUTURE-ME

# Install dependencies
npm install --legacy-peer-deps

# Copy env example and add keys if you have them
cp .env.example .env.local

# Run locally (works without keys using in-memory mock + mock AI)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You can complete the full flow with mock data; no keys required for a first run.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (optional; without it, app uses in-memory store). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (optional). |
| `GEMINI_API_KEY` | Google Gemini API key for real AI conversation (optional; mock responses used if missing). |

### Database (Supabase)

Run the SQL files in `supabase/migrations/` in order in your Supabase project's SQL Editor to create tables and RLS policies.

### Project Structure

See **[STRUCTURE.md](./STRUCTURE.md)** for folder layout and architecture details.

---

## License

MIT (or specify your license when chosen).

---

*Future Me — Talk to the person you're becoming.*
