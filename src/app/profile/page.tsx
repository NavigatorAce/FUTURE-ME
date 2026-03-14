"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LifeStage } from "@/types";

const LIFE_STAGES: { value: LifeStage; label: string }[] = [
  { value: "early_career", label: "Early career" },
  { value: "mid_career", label: "Mid career" },
  { value: "career_transition", label: "Career transition" },
  { value: "student", label: "Student" },
  { value: "exploring", label: "Exploring" },
  { value: "other", label: "Other" },
];

const TRAIT_OPTIONS = [
  "Curious", "Cautious", "Ambitious", "Reflective", "Creative", "Practical",
  "Empathetic", "Independent", "Driven", "Calm", "Anxious", "Optimistic",
];

export default function ProfilePage() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [lifeStage, setLifeStage] = useState<LifeStage>("exploring");
  const [traits, setTraits] = useState<string[]>([]);
  const [goals, setGoals] = useState("");
  const [fears, setFears] = useState("");
  const [struggles, setStruggles] = useState("");
  const [additional, setAdditional] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleTrait(t: string) {
    setTraits((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(age, 10) || 30,
          lifeStage,
          personalityTraits: traits,
          goals,
          fears,
          currentStruggles: struggles,
          additionalContext: additional || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      router.push("/branches");
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl md:text-4xl text-foreground">
            Your current self
          </h1>
          <p className="mt-3 text-muted-foreground">
            A few questions to ground your future branches in who you are today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="rounded-3xl border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle className="text-lg">Basics</CardTitle>
              <CardDescription>Age and life stage help shape plausible futures.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min={16}
                    max={100}
                    placeholder="e.g. 28"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Life stage</Label>
                  <div className="flex flex-wrap gap-2">
                    {LIFE_STAGES.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setLifeStage(s.value)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                          lifeStage === s.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle className="text-lg">Personality</CardTitle>
              <CardDescription>Select a few traits that feel true to you.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {TRAIT_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTrait(t)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                      traits.includes(t)
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle className="text-lg">Goals, fears, and struggles</CardTitle>
              <CardDescription>In your own words. This gives your future selves something to respond to.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="goals">What are you working toward?</Label>
                <Textarea
                  id="goals"
                  placeholder="e.g. A more meaningful career, better balance, a family…"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fears">What scares or worries you?</Label>
                <Textarea
                  id="fears"
                  placeholder="e.g. Missing out, failure, disappointing others…"
                  value={fears}
                  onChange={(e) => setFears(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="struggles">What are you struggling with right now?</Label>
                <Textarea
                  id="struggles"
                  placeholder="e.g. Burnout, indecision, loneliness…"
                  value={struggles}
                  onChange={(e) => setStruggles(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additional">Anything else you’d like your future selves to know (optional)</Label>
                <Textarea
                  id="additional"
                  placeholder="Context, values, or a situation you’re sitting with."
                  value={additional}
                  onChange={(e) => setAdditional(e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Saving…" : "Save and generate my branches"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
