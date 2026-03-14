"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "Profile" },
  { href: "/branches", label: "Branches" },
  { href: "/ask", label: "Ask" },
  { href: "/history", label: "History" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-90"
        >
          Branch Self
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
          <Link
            href="/login"
            className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
