"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth, getDisplayNameFromAuth } from "@/hooks/useAuth";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "Profile" },
  { href: "/ask", label: "Chat" },
  { href: "/history", label: "History" },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLeaveChatModal, setShowLeaveChatModal] = useState(false);
  const { user, profile, isLoggedIn, loading, signOut } = useAuth();
  const displayName = getDisplayNameFromAuth(profile, user);
  const isChatPage = pathname === "/ask" || pathname === "/chat";

  function handleProfileClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!isChatPage) return;
    e.preventDefault();
    setShowLeaveChatModal(true);
  }

  function confirmLeaveChat() {
    setShowLeaveChatModal(false);
    router.push("/profile");
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-90"
        >
          Future Me
        </Link>
        <nav className="flex items-center gap-8">
          {navItems
            .filter((item) => item.href !== "/")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={item.href === "/profile" ? handleProfileClick : undefined}
                className={cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  pathname === item.href && "text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          {/* Auth slot: show Sign in when not logged in (or while loading so no grey box); show user + Sign out when logged in */}
          {!loading && isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                onClick={handleProfileClick}
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {displayName}
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-2xl border border-border bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-2xl bg-[hsl(160,45%,48%)] px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-[hsl(160,45%,55%)] hover:shadow-lg"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
      </header>

      {showLeaveChatModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-foreground">Leave chat now?</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              If you leave Chat now, your current chat history will be deleted. You can continue to Profile or stay in Chat.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLeaveChatModal(false)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Stay in Chat
              </button>
              <button
                type="button"
                onClick={confirmLeaveChat}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Continue to Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
