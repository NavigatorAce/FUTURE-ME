import type {
  CurrentSelfProfile,
  FutureBranch,
  BranchSlug,
} from "@/types";
import { openai } from "@/lib/openai/client";
import {
  getBranchesGenerationPrompt,
  getBranchesUserMessage,
  getAnswerGenerationPrompt,
} from "@/lib/openai/prompts";

const USE_MOCK = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-placeholder";

const MOCK_BRANCHES: Omit<FutureBranch, "id" | "profileId" | "createdAt">[] = [
  {
    slug: "stable_growth",
    title: "The Steady Builder",
    ageAtFuture: 45,
    oneLiner: "You kept building step by step, and it added up.",
    coreValues: ["Consistency", "Trust", "Family", "Security"],
    signatureMessage:
      "I’m glad we didn’t rush. The path was long, but it was ours.",
  },
  {
    slug: "bold_turning_point",
    title: "The One Who Leaped",
    ageAtFuture: 48,
    oneLiner: "You took the leap and learned to fly on the way down.",
    coreValues: ["Courage", "Curiosity", "Authenticity", "Growth"],
    signatureMessage:
      "The scariest part was the moment before the jump. After that, everything changed.",
  },
  {
    slug: "self_reconciliation",
    title: "The One Who Came Home to Themselves",
    ageAtFuture: 46,
    oneLiner: "You stopped running and started listening.",
    coreValues: ["Peace", "Boundaries", "Self-compassion", "Presence"],
    signatureMessage:
      "We had to slow down to finally meet ourselves. It was worth it.",
  },
];

export async function generateBranches(
  profile: CurrentSelfProfile
): Promise<Omit<FutureBranch, "id" | "profileId" | "createdAt">[]> {
  if (USE_MOCK) {
    return MOCK_BRANCHES;
  }
  const sys = getBranchesGenerationPrompt(profile);
  const user = getBranchesUserMessage();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("No content in OpenAI response");
  const parsed = JSON.parse(content) as { branches: typeof MOCK_BRANCHES };
  return parsed.branches;
}

export async function generateAnswerForBranch(
  question: string,
  branch: FutureBranch,
  profile: CurrentSelfProfile
): Promise<string> {
  if (USE_MOCK) {
    return getMockAnswer(branch.slug, question);
  }
  const prompt = getAnswerGenerationPrompt(question, branch, profile);
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  const text = completion.choices[0]?.message?.content?.trim();
  return text || "I don’t have a clear answer for that right now.";
}

function getMockAnswer(slug: BranchSlug, _question: string): string {
  const mocks: Record<BranchSlug, string> = {
    stable_growth:
      "Looking back, I’d say: don’t rush the big decisions. The path that felt slow was the one that let me build something lasting. Take the next small step that feels right, and repeat.",
    bold_turning_point:
      "The biggest gift was giving myself permission to change direction. If something in you is pulling you elsewhere, it’s worth listening—even if it’s scary. I didn’t have it all figured out when I jumped.",
    self_reconciliation:
      "What helped most was learning to be kind to myself and to say no when I needed to. The answers didn’t come from doing more; they came from pausing and asking what I actually wanted.",
  };
  return mocks[slug];
}
