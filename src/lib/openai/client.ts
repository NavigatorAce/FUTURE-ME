import OpenAI from "openai";

// TODO: Add OPENAI_API_KEY to .env.local
if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set; AI generation will use mocks.");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-placeholder",
});
