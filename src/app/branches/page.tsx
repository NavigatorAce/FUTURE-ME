"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { FutureBranchUI } from "@/types";

const ACCENT_MAP = {
  stable_growth: "emerald" as const,
  bold_turning_point: "amber" as const,
  self_reconciliation: "violet" as const,
};

const accentClasses = {
  emerald: "border-emerald-500/30 bg-emerald-950/20 shadow-emerald-500/5",
  amber: "border-amber-500/30 bg-amber-950/20 shadow-amber-500/5",
  violet: "border-violet-500/30 bg-violet-950/20 shadow-violet-500/5",
};

export default function BranchesPage() {
  const [branches, setBranches] = useState<FutureBranchUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/branches");
        const data = await res.json();
        if (Array.isArray(data.branches)) {
          setBranches(
            data.branches.map((b: FutureBranchUI) => ({
              ...b,
              accent: ACCENT_MAP[b.slug as keyof typeof ACCENT_MAP] ?? "emerald",
            }))
          );
        } else {
          setBranches([]);
        }
      } catch {
        setBranches([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="section-padding flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading your branches…</p>
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="section-padding text-center">
        <h1 className="font-display text-3xl text-foreground">No branches yet</h1>
        <p className="mt-4 text-muted-foreground">
          Complete your current self profile to generate your three future paths.
        </p>
        <Button asChild className="mt-8" size="lg">
          <Link href="/profile">Go to profile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <h1 className="font-display text-3xl md:text-4xl text-foreground">
            Your future branches
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Three possible versions of you. Each has walked a different path—and each can answer your question.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {branches.map((branch, i) => (
            <Card
              key={branch.id}
              className={`rounded-3xl border shadow-lg transition-all duration-300 hover:shadow-xl ${accentClasses[branch.accent ?? "emerald"]}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CardHeader className="pb-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {branch.slug.replace(/_/g, " ")}
                </p>
                <h2 className="font-display text-2xl text-foreground">
                  {branch.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Age {branch.ageAtFuture} in this path
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed">
                  {branch.oneLiner}
                </p>
                <div className="flex flex-wrap gap-2">
                  {branch.coreValues?.map((v) => (
                    <span
                      key={v}
                      className="rounded-lg bg-muted/80 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {v}
                    </span>
                  ))}
                </div>
                <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground text-sm">
                  "{branch.signatureMessage}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button asChild size="lg">
            <Link href="/ask">Ask a question</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
