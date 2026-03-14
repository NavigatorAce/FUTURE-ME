"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const { user, profile, isLoggedIn, loading, signOut } = useAuth();
  const displayName = getDisplayNameFromAuth(profile, user);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href={isLoggedIn ? "/profile" : "/"}
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
  );
}
