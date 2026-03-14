/**
 * Shared types for Branch Self
 * Clean separation between DB models and UI/DTOs
 */

// ============ Profile (Current Self) ============

export type LifeStage =
  | "early_career"
  | "mid_career"
  | "career_transition"
  | "student"
  | "exploring"
  | "other";

export type StudyOrWorkStatus = "studying" | "working";

export interface CurrentSelfProfile {
  id?: string;
  userId: string;
  profileName?: string;
  name?: string;
  status?: StudyOrWorkStatus;
  university?: string;
  major?: string;
  job?: string;
  age: number;
  lifeStage: LifeStage;
  personalityTraits: string[];
  goals: string;
  fears: string;
  currentStruggles: string;
  additionalContext?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CurrentSelfProfileFormData
  extends Omit<CurrentSelfProfile, "userId" | "id" | "createdAt" | "updatedAt"> {}

// ============ Future Branches ============

export type BranchSlug = "stable_growth" | "bold_turning_point" | "self_reconciliation";

export interface FutureBranch {
  id: string;
  profileId: string;
  slug: BranchSlug;
  title: string;
  ageAtFuture: number;
  oneLiner: string;
  coreValues: string[];
  signatureMessage: string;
  createdAt?: string;
}

export interface FutureBranchUI extends FutureBranch {
  /** Optional accent for card styling */
  accent?: "emerald" | "amber" | "violet";
}

// ============ Dialogue Session ============

export interface DialogueSession {
  id: string;
  userId: string;
  profileId: string;
  question: string;
  createdAt: string;
}

export interface BranchAnswer {
  id: string;
  sessionId: string;
  branchId: string;
  branchSlug: BranchSlug;
  answerText: string;
  createdAt?: string;
}

export interface DialogueSessionWithAnswers extends DialogueSession {
  branches?: FutureBranch[];
  answers: BranchAnswer[];
}

// ============ API / Service ============

export interface GenerateBranchesInput {
  profile: CurrentSelfProfile;
}

export interface GenerateBranchesOutput {
  branches: Omit<FutureBranch, "id" | "profileId" | "createdAt">[];
}

export interface GenerateAnswersInput {
  question: string;
  branches: FutureBranch[];
  profile: CurrentSelfProfile;
}

export interface GenerateAnswersOutput {
  answers: { branchSlug: BranchSlug; answerText: string }[];
}
