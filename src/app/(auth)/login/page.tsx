"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // TODO: Wire to Supabase auth when NEXT_PUBLIC_SUPABASE_URL is set
      const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!hasSupabase) {
        setMessage({
          type: "success",
          text: "Auth is mocked. Redirecting to profile…",
        });
        setTimeout(() => {
          window.location.href = "/profile";
        }, 800);
        return;
      }
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, signUp: isSignUp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Auth failed");
      setMessage({ type: "success", text: isSignUp ? "Check your email to confirm." : "Signed in." });
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center section-padding">
      <div className="absolute inset-0 bg-mesh opacity-50" />
      <Card className="relative w-full max-w-md rounded-3xl border-border/50 bg-card/95 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-display text-2xl">
            {isSignUp ? "Create your account" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Sign up to save your profile and revisit your branches."
              : "Sign in to continue to your branches."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {message && (
              <p
                className={`text-sm ${
                  message.type === "success" ? "text-primary" : "text-red-400"
                }`}
              >
                {message.text}
              </p>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Please wait…" : isSignUp ? "Sign up" : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              className="font-medium text-foreground underline-offset-4 hover:underline"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(null);
              }}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
