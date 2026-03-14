"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const YEAR_OPTIONS = [5, 10, 15] as const;

export default function AskPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [yearsAhead, setYearsAhead] = useState<number>(10);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
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
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't respond right now. Please try again.",
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
      {/* Header with time selector */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
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
