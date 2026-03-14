"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AskPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get answers");
      router.push(`/results/${data.sessionId}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="section-padding flex min-h-[80vh] items-center justify-center">
      <div className="absolute inset-0 bg-mesh opacity-30" />
      <div className="relative mx-auto w-full max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl md:text-4xl text-foreground">
            Ask one question
          </h1>
          <p className="mt-3 text-muted-foreground">
            Your three future selves will each answer from their path. One question, three perspectives.
          </p>
        </div>

        <Card className="rounded-3xl border-border/50 bg-card/90 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-lg font-normal text-muted-foreground">
              What do you need to hear from your possible futures?
            </CardTitle>
            <CardDescription>
              e.g. “Should I take the job in another city?” or “How do I make peace with my past?”
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Textarea
                placeholder="Type your question here…"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[160px] resize-none text-base"
                required
              />
              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={loading || !question.trim()}>
                  {loading ? "Asking your future selves…" : "Get three answers"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
