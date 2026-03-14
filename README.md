# Branch Self

**Talk to different future versions of yourself through parallel life branches.**

---

## One-Sentence Pitch

Branch Self is an AI experience that lets you build a profile of who you are today, generate three distinct future personas from different life paths, and ask them the same question—so you get multi-perspective, emotionally grounded advice instead of generic chatbot answers.

---

## Overview

Branch Self is not a fortune teller. It’s a **reflective AI product** that helps you think through uncertainty by talking to possible future versions of yourself. You define your current self (age, stage, goals, fears, struggles). The system creates three future personas based on different life branches—**Stable Growth**, **Bold Turning Point**, and **Self-Reconciliation**. You ask one question; all three answer. The result is self-exploration, decision support, and emotional companionship through branching futures.

---

## Problem

- **Uncertainty and anxiety** — People struggle with major life decisions and fear of the unknown.
- **Passive journaling** — Writing alone often doesn’t surface new perspectives or “what if” scenarios.
- **Generic AI chat** — Standard chatbots feel impersonal and don’t reflect *your* story or possible futures.
- **Craving resonance** — People want advice that feels personal, emotionally honest, and tied to their own possible paths.

---

## Solution

Branch Self turns “what might I become?” into a concrete, interactive experience:

1. **Current Self Profile** — You build a short profile: age, life stage, personality, goals, fears, and current struggles.
2. **Three Future Personas** — The system generates three distinct future selves from different life branches.
3. **One Question, Three Answers** — You ask a single question; each future self responds from their path.
4. **Multi-perspective insight** — You compare answers to see how different choices and growth paths lead to different advice—all grounded in *your* context.

The product does **not** predict the future. It supports **self-reflection**, **decision support**, and **exploration of possible versions of your life**.

---

## Core Features

| Feature | Description |
|--------|-------------|
| **Current Self Profile Builder** | Capture age, life stage, personality, goals, fears, and current struggles in a structured flow. |
| **AI Future Persona Generation** | Three personas: Stable Growth, Bold Turning Point, Self-Reconciliation—each with a distinct “future self” voice. |
| **Parallel Branch Comparison** | Ask one question and view side-by-side (or sequential) answers from all three future selves. |
| **Future Self Q&A** | Natural-language questions with answers that stay in character and aligned to each branch. |
| **Conversation History / Saved Sessions** | Save sessions and revisit past questions and answers. |
| **Shareable Results** | (Optional) Export or share a summary of your question and the three responses for reflection or sharing. |

---

## How It Works

1. **Enter your current profile** — Age, stage, personality traits, goals, fears, struggles (minimal required fields for MVP).
2. **System creates 3 future branches** — Stable Growth, Bold Turning Point, Self-Reconciliation; each gets a short persona description.
3. **You ask a question** — One free-form question (e.g. “Should I take the job in another city?”).
4. **Each future self answers** — Each persona responds in character, from their path’s assumptions and values.
5. **You compare insights** — Read all three answers to inform your thinking without a single “right” prediction.

---

## Why It’s Different

| Alternative | How Branch Self Differs |
|-------------|-------------------------|
| **Generic chatbots** | Advice is tied to *your* profile and *your* possible futures, not one-size-fits-all. |
| **Journaling apps** | You get active dialogue with multiple “future you” perspectives, not just your current self writing. |
| **Personality tests** | Focus is on branching *futures* and decision support, not static labels. |
| **Fortune-telling / prediction** | We don’t claim to predict the future; we help you explore and reflect on possible paths. |

---

## Example Use Cases

- **Career choice** — “If I stay in this role vs. pivot to a new industry, what would my future self say?”
- **Relationship uncertainty** — “What would a future me who chose to stay vs. leave say about this relationship?”
- **Moving cities** — “How would my stable-path self vs. my bold-turn self advise me on relocating?”
- **Burnout / self-growth** — “What would a reconciled, calmer future self tell me about pace and boundaries?”
- **Big life transitions** — Marriage, parenthood, retirement—explore how different paths would respond to the same dilemma.

---

## Tech Stack

*Placeholder—update when stack is defined.*

| Layer | Technology |
|-------|------------|
| **Frontend** | TBD (e.g. React / Next.js) |
| **Backend** | TBD (e.g. Node.js / Python) |
| **AI / LLM** | TBD (e.g. OpenAI API / Anthropic) |
| **Database** | TBD (e.g. PostgreSQL / Supabase) |
| **Deployment** | TBD (e.g. Vercel / Railway) |

---

## MVP Scope

The first version includes:

- **3 fixed future branches** — Stable Growth, Bold Turning Point, Self-Reconciliation.
- **1 user question input** — Single question per session; all three personas answer.
- **3 AI-generated answers** — One response per future self, shown together for comparison.
- **Minimal profile setup** — Essential fields only (age, stage, goals, fears, struggles).
- **Saved result page** — View and (where implemented) revisit past Q&A sessions.

---

## Future Roadmap

- **More branch types** — User-selectable or custom life paths (e.g. “Creative risk”, “Family-first”).
- **Long-term memory** — Persist profile and past sessions for continuity across visits.
- **Voice-based future selves** — Optional voice output for each persona.
- **Visual avatars** — Simple avatars or visuals per branch for stronger identity.
- **Personalized branch tuning** — Let users nudge branch definitions (e.g. “more conservative” or “more adventurous”).
- **Longitudinal growth tracking** — Compare “future you” answers over time as your profile evolves.

---

## Philosophy / Product Positioning

- **Not a prediction engine** — We do not claim to predict your actual future.
- **Reflective AI experience** — The value is in thinking through choices by engaging with *possible* future selves.
- **Self-exploration and support** — We aim to help users feel less alone with uncertainty and more equipped to reflect on their options.

---

## Getting Started

*Placeholder—replace with real setup once the repo has runnable code.*

### Prerequisites

- Node.js 18+ (or Python 3.10+ if backend is Python)
- An API key for the chosen LLM provider (e.g. OpenAI, Anthropic)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/branch-self.git
cd branch-self

# Install dependencies (example; adjust for your stack)
npm install
# or: pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env and add your LLM API key (e.g. OPENAI_API_KEY=...)

# Run locally
npm run dev
# or: python app.py
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` (or equivalent) | API key for the LLM used for persona generation and Q&A. |

---

## License

MIT (or specify your license when chosen).

---

*Branch Self — Explore who you might become.*
