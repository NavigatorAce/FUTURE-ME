/**
 * In-memory store for MVP when Supabase is not configured.
 * TODO: Remove or replace when Supabase is wired; data is lost on server restart.
 */

import type { CurrentSelfProfile, FutureBranch, DialogueSession, BranchAnswer } from "@/types";

let mockProfile: (CurrentSelfProfile & { id: string }) | null = null;
let mockBranches: FutureBranch[] = [];
const mockSessions: Map<string, DialogueSession & { answers: BranchAnswer[] }> = new Map();

const MOCK_USER_ID = "mock-user-id";

export const mockStore = {
  getUserId: () => MOCK_USER_ID,

  getProfile(): (CurrentSelfProfile & { id: string }) | null {
    return mockProfile;
  },

  setProfile(p: Omit<CurrentSelfProfile, "id" | "createdAt" | "updatedAt">): CurrentSelfProfile & { id: string } {
    const id = mockProfile?.id ?? "mock-profile-id";
    const now = new Date().toISOString();
    mockProfile = {
      ...p,
      id,
      userId: p.userId,
      createdAt: mockProfile?.createdAt ?? now,
      updatedAt: now,
    };
    return mockProfile;
  },

  getBranches(): FutureBranch[] {
    return mockBranches;
  },

  setBranches(profileId: string, branches: Omit<FutureBranch, "id" | "profileId" | "createdAt">[]): FutureBranch[] {
    const now = new Date().toISOString();
    mockBranches = branches.map((b, i) => ({
      ...b,
      id: `mock-branch-${i}`,
      profileId,
      createdAt: now,
    }));
    return mockBranches;
  },

  createSession(userId: string, profileId: string, question: string): DialogueSession {
    const id = `mock-session-${Date.now()}`;
    const session: DialogueSession = {
      id,
      userId,
      profileId,
      question,
      createdAt: new Date().toISOString(),
    };
    mockSessions.set(id, { ...session, answers: [] });
    return session;
  },

  setAnswers(sessionId: string, answers: { branchId: string; branchSlug: string; answerText: string }[]): BranchAnswer[] {
    const session = mockSessions.get(sessionId);
    if (!session) return [];
    const now = new Date().toISOString();
    const result: BranchAnswer[] = answers.map((a, i) => ({
      id: `mock-answer-${i}`,
      sessionId,
      branchId: a.branchId,
      branchSlug: a.branchSlug as BranchAnswer["branchSlug"],
      answerText: a.answerText,
      createdAt: now,
    }));
    mockSessions.set(sessionId, { ...session, answers: result });
    return result;
  },

  getSession(sessionId: string): (DialogueSession & { answers: BranchAnswer[] }) | null {
    return mockSessions.get(sessionId) ?? null;
  },

  getSessions(userId: string): DialogueSession[] {
    return Array.from(mockSessions.values())
      .filter((s) => s.userId === userId)
      .map(({ answers: _, ...s }) => s)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
};
