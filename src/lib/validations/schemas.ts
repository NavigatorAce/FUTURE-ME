/**
 * Zod schemas for API request validation.
 * Kept in sync with src/types/index.ts (LifeStage, profile shape, etc.).
 */

import { z } from "zod";

const LIFE_STAGES = [
  "early_career",
  "mid_career",
  "career_transition",
  "student",
  "exploring",
  "other",
] as const;

const MAX_TEXT_LENGTH = 10_000;
const MAX_ARRAY_LENGTH = 50;
const AGE_MIN = 16;
const AGE_MAX = 120;
const QUESTION_MAX_LENGTH = 2_000;
const MESSAGES_MAX_LENGTH = 50;
const SINGLE_MESSAGE_MAX_LENGTH = 8_000;
const YEARS_AHEAD_MIN = 1;
const YEARS_AHEAD_MAX = 60;

/** POST /api/profile — request body */
export const profilePostSchema = z.object({
  profileName: z.string().max(200).optional().default(""),
  name: z.string().max(200).optional().default(""),
  status: z.enum(["studying", "working"]).optional(),
  university: z.string().max(300).optional().default(""),
  major: z.string().max(200).optional().default(""),
  job: z.string().max(300).optional().default(""),
  age: z.coerce.number().int().min(AGE_MIN).max(AGE_MAX).optional().default(30),
  lifeStage: z.enum(LIFE_STAGES).optional().default("exploring"),
  personalityTraits: z
    .array(z.string().max(100))
    .max(MAX_ARRAY_LENGTH)
    .optional()
    .default([]),
  goals: z.string().max(MAX_TEXT_LENGTH).optional().default(""),
  fears: z.string().max(MAX_TEXT_LENGTH).optional().default(""),
  currentStruggles: z.string().max(MAX_TEXT_LENGTH).optional().default(""),
  additionalContext: z.string().max(MAX_TEXT_LENGTH).optional(),
});

export type ProfilePostInput = z.infer<typeof profilePostSchema>;

/** POST /api/ask — request body */
export const askPostSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .max(QUESTION_MAX_LENGTH),
});

export type AskPostInput = z.infer<typeof askPostSchema>;

/** POST /api/chat — request body */
const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(SINGLE_MESSAGE_MAX_LENGTH),
});

export const chatPostSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1, "At least one message is required")
    .max(MESSAGES_MAX_LENGTH),
  yearsAhead: z
    .coerce.number()
    .int()
    .min(YEARS_AHEAD_MIN)
    .max(YEARS_AHEAD_MAX)
    .optional()
    .default(10),
});

export type ChatPostInput = z.infer<typeof chatPostSchema>;
