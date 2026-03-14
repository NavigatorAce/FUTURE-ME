"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DialogueSessionWithAnswers } from "@/types";

const ACCENT_MAP: Record<string, string> = {
  stable_growth: "border-emerald-500/30 bg-emerald-950/20",
  bold_turning_point: "border-amber-500/30 bg-amber-950/20",
  self_reconciliation: "border-violet-500/30 bg-violet-950/20",
};

const TITLE_MAP: Record<string, string> = {
  stable_growth: "Stable Growth",
  bold_turning_point: "Bold Turning Point",
  self_reconciliation: "Self-Reconciliation",
};

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<DialogueSessionWithAnswers | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        const data = await res.json();
        if (res.ok && data.session) setSession(data.session);
        else setSession(null);
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="section-padding flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading your answers…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="section-padding text-center">
        <h1 className="font-display text-2xl text-foreground">Session not found</h1>
        <Button asChild className="mt-6">
          <Link href="/ask">Ask a new question</Link>
        </Button>
      </div>
    );
  }

  const { question, answers, branches } = session;
  const branchMap = new Map(branches?.map((b) => [b.id, b]) ?? []);

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Your question
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mt-2 prose-width mx-auto leading-snug">
            {question}
          </h1>
        </div>

        <div className="space-y-8">
          {answers.map((a) => {
            const branch = branchMap.get(a.branchId);
            const title = TITLE_MAP[a.branchSlug] ?? a.branchSlug;
            const accent = ACCENT_MAP[a.branchSlug] ?? "border-border bg-card";
            return (
              <Card
                key={a.id}
                className={`rounded-3xl border ${accent} shadow-md`}
              >
                <CardHeader className="pb-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {title}
                  </p>
                  {branch && (
                    <p className="font-display text-lg text-foreground">
                      {branch.title}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="prose-width text-foreground leading-relaxed whitespace-pre-wrap">
                    {a.answerText}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-14 rounded-2xl border border-border/50 bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            These answers are from possible future versions of you—not predictions. Use them to reflect, not to decide for you.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild variant="secondary">
            <Link href="/history">View history</Link>
          </Button>
          <Button asChild>
            <Link href="/ask">Ask another question</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
