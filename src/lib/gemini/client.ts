import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Native Google Gemini client.
 * Reads GEMINI_API_KEY from environment variables.
 */
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set; AI generation will use mocks.");
}

export const genAI = new GoogleGenerativeAI(apiKey || "placeholder");

export const GEMINI_MODEL = "gemini-3-flash-preview";
