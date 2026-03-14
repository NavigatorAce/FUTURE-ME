"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CurrentSelfProfile, Gender } from "@/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const YEAR_OPTIONS = [5, 10, 15] as const;

type AgeGroup = "young" | "middle" | "senior";

function getAgeGroup(age: number): AgeGroup {
  if (age < 30) return "young";
  if (age < 60) return "middle";
  return "senior";
}

function getAvatarStyle(gender: Gender | undefined, age: number) {
  const ageGroup = getAgeGroup(age);

  const shirtByGender: Record<Gender, string> = {
    male: "#2D8D73",
    female: "#8C63D9",
    other: "#3A7BD5",
  };
  const hairByGender: Record<Gender, string> =
    ageGroup === "senior"
      ? { male: "#E6E9EF", female: "#ECE7F5", other: "#E6EBF6" }
      : {
          male: ageGroup === "middle" ? "#4A4A4A" : "#2F2A26",
          female: ageGroup === "middle" ? "#5A4A43" : "#3A2B24",
          other: ageGroup === "middle" ? "#4F4B57" : "#2D3142",
        };

  const normalizedGender: Gender = gender ?? "other";
  const shirt = shirtByGender[normalizedGender];
  const hair = hairByGender[normalizedGender];
  const skin =
    ageGroup === "young" ? "#F2C7A6" : ageGroup === "middle" ? "#E8B892" : "#D8A783";

  return { ageGroup, shirt, hair, skin, gender: normalizedGender };
}

function FutureMeAvatar({
  gender,
  futureAge,
}: {
  gender: Gender | undefined;
  futureAge: number;
}) {
  if (!gender || gender === "other") {
    return (
      <div className="h-12 w-12 shrink-0 rounded-2xl border border-primary/20 bg-card/70 p-1.5 shadow-sm">
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect x="2" y="2" width="60" height="60" rx="14" fill="#141822" />
          <circle cx="32" cy="27" r="10" fill="none" stroke="#74809A" strokeWidth="2.2" />
          <path
            d="M16 51c4-8 10-12 16-12s12 4 16 12"
            fill="none"
            stroke="#74809A"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <rect
            x="9"
            y="9"
            width="46"
            height="46"
            rx="10"
            fill="none"
            stroke="#394154"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
        </svg>
      </div>
    );
  }

  const { ageGroup, shirt, hair, skin, gender: normalizedGender } = getAvatarStyle(gender, futureAge);
  const showSmile = ageGroup === "young";
  const showSeniorGlasses = ageGroup === "senior";
  const showMiddleLines = ageGroup === "middle";
  const showSeniorLines = ageGroup === "senior";
  const safeAge = Math.max(0, Math.min(99, Math.round(futureAge)));

  return (
    <div className="h-12 w-12 shrink-0 rounded-2xl border border-primary/30 bg-card/80 p-1.5 shadow-sm">
      <svg viewBox="0 0 64 64" className="h-full w-full">
        <rect x="2" y="2" width="60" height="60" rx="14" fill="#141822" />
        <circle cx="32" cy="35" r="16" fill={skin} />
        <path
          d={ageGroup === "senior" ? "M14 63c4-11 10-16 18-16s14 5 18 16" : "M16 63c3-11 9-15 16-15s13 4 16 15"}
          fill={shirt}
        />

        {normalizedGender === "female" && (
          <path
            d={
              ageGroup === "senior"
                ? "M15 37c0-12 8-20 17-20s17 8 17 20c0 0-3-7-9-10-2 5-5 7-8 7s-6-2-8-7c-6 3-9 10-9 10z"
                : "M16 36c0-11 7-19 16-19s16 8 16 19c0 0-2-6-8-8-2 4-5 6-8 6s-6-2-8-6c-6 2-8 8-8 8z"
            }
            fill={hair}
          />
        )}
        {normalizedGender === "male" && (
          <path
            d={
              ageGroup === "senior"
                ? "M17 35c1-11 7-18 15-18s14 7 15 18c-3-4-9-6-15-6s-12 2-15 6z"
                : "M18 34c0-10 7-17 14-17s14 7 14 17c-3-4-8-6-14-6s-11 2-14 6z"
            }
            fill={hair}
          />
        )}
        {normalizedGender === "other" && (
          <path
            d={
              ageGroup === "senior"
                ? "M16 35c1-11 8-19 16-19s15 8 16 19c-4-4-10-6-16-6s-12 2-16 6z"
                : "M17 34c1-10 7-18 15-18s14 8 15 18c-4-4-9-6-15-6s-11 2-15 6z"
            }
            fill={hair}
          />
        )}

        <circle cx="26" cy="35" r="1.8" fill="#1D1D1D" />
        <circle cx="38" cy="35" r="1.8" fill="#1D1D1D" />

        {showSeniorGlasses && (
          <>
            <rect x="21.5" y="31.8" width="9" height="6" rx="2.5" fill="none" stroke="#9FA7B8" strokeWidth="1.1" />
            <rect x="33.5" y="31.8" width="9" height="6" rx="2.5" fill="none" stroke="#9FA7B8" strokeWidth="1.1" />
            <path d="M30.5 34.8h3" stroke="#9FA7B8" strokeWidth="1.1" strokeLinecap="round" />
          </>
        )}

        {showSmile ? (
          <path d="M26 42c2 2 4 3 6 3s4-1 6-3" fill="none" stroke="#4A2A1F" strokeWidth="1.8" strokeLinecap="round" />
        ) : (
          <path d="M26 43h12" fill="none" stroke="#4A2A1F" strokeWidth="1.8" strokeLinecap="round" />
        )}

        {showMiddleLines && (
          <>
            <path d="M22 37h2" stroke="#C99674" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M40 37h2" stroke="#C99674" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {showSeniorLines && (
          <>
            <path d="M20 37h3" stroke="#B88767" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M41 37h3" stroke="#B88767" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M24 45c2 1 5 2 8 2s6-1 8-2" fill="none" stroke="#B88767" strokeWidth="1.1" strokeLinecap="round" />
          </>
        )}

        <rect x="19" y="52" width="26" height="8" rx="4" fill="#1E2431" />
        <text x="32" y="58" textAnchor="middle" fontSize="6.6" fill="#AFC4FF" fontWeight="700">
          {safeAge}y
        </text>
      </svg>
    </div>
  );
}

export default function AskPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [yearsAhead, setYearsAhead] = useState<number>(10);
  const [profile, setProfile] = useState<CurrentSelfProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // When landing on chat (from Profile "Save and continue" or nav "Chat"), scroll to top so the 5/10/15 yrs row is visible
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (cancelled) return;
        setProfile(data.profile ?? null);
      } catch {
        // keep null profile fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, yearsAhead }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get response");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (err) {
      console.error(err);
      const errorText =
        err instanceof Error && err.message
          ? err.message
          : "Sorry, I couldn't respond right now. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorText,
        },
      ]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header with time selector: directly under Profile/Chat/History nav, sticky so it stays visible */}
      <div className="sticky top-16 z-40 border-b border-border/40 bg-background/80 backdrop-blur-sm shrink-0">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl text-foreground">
                Future Me
              </h1>
              <p className="text-sm text-muted-foreground">
                Talk to the you from {yearsAhead} years ahead
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-1">
                Talk to me in:
              </span>
              {YEAR_OPTIONS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => {
                    setYearsAhead(y);
                    // Clear conversation when switching time horizon
                    if (y !== yearsAhead) {
                      setMessages([]);
                    }
                  }}
                  className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                    yearsAhead === y
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {y} yrs
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-2xl">🔮</span>
              </div>
              <h2 className="font-display text-2xl text-foreground mb-3">
                Hey, it&apos;s you — {yearsAhead} years from now.
              </h2>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                I remember exactly where you are right now. Ask me anything — about
                the decisions you&apos;re facing, the fears you have, or just what
                it&apos;s like on the other side.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {[
                  "Should I take that risk?",
                  "Does the anxiety get better?",
                  "What do you wish we'd done differently?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setInput(suggestion);
                      textareaRef.current?.focus();
                    }}
                    className="rounded-2xl border border-border/60 bg-card/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="mr-3 mt-1">
                  <FutureMeAvatar
                    gender={profile?.gender}
                    futureAge={(profile?.age ?? 22) + yearsAhead}
                  />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border/50 text-foreground rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" && (
                  <p className="text-xs font-medium text-primary/80 mb-1.5">
                    Future Me · {yearsAhead}yrs ahead
                  </p>
                )}
                <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="mr-3 mt-1">
                <FutureMeAvatar
                  gender={profile?.gender}
                  futureAge={(profile?.age ?? 22) + yearsAhead}
                />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-card border border-border/50 px-5 py-3">
                <p className="text-xs font-medium text-primary/80 mb-1.5">
                  Future Me · {yearsAhead}yrs ahead
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              placeholder="Ask your future self anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[48px] max-h-[160px] resize-none rounded-2xl text-[15px]"
              rows={1}
              disabled={loading}
            />
            <Button
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="rounded-2xl h-12 px-6 shrink-0"
            >
              {loading ? "…" : "Send"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-center text-muted-foreground/60">
            This is a reflective experience, not a prediction. Future Me speaks from
            a possible path based on who you are today.
          </p>
        </div>
      </div>
    </div>
  );
}
