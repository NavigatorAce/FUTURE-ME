"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DialogueSession } from "@/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return s.slice(0, max).trim() + "…";
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<DialogueSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();
        setSessions(Array.isArray(data.sessions) ? data.sessions : []);
      } catch {
        setSessions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="section-padding flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading your reflections…</p>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl md:text-4xl text-foreground">
            Your past reflections
          </h1>
          <p className="mt-3 text-muted-foreground">
            Questions you’ve asked and the answers from your three future selves.
          </p>
        </div>

        {sessions.length === 0 ? (
          <Card className="rounded-3xl border-border/50 bg-card/80 text-center py-16">
            <CardContent>
              <p className="text-muted-foreground">No sessions yet.</p>
              <Button asChild className="mt-6">
                <Link href="/ask">Ask your first question</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-6">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link href={`/results/${s.id}`}>
                  <Card className="rounded-3xl border-border/50 bg-card/80 transition-all hover:border-primary/30 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(s.createdAt)}
                      </p>
                      <h2 className="font-display text-lg text-foreground leading-snug">
                        {truncate(s.question, 80)}
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        View three answers →
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
