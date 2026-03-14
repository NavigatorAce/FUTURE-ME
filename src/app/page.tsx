import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
      <section className="relative section-padding flex flex-col items-center justify-center text-center">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground max-w-4xl mx-auto leading-[1.15] animate-fade-in">
          Talk to different future versions of yourself.
        </h1>
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
          Not fortune-telling. A reflective space to explore who you might become—through three possible paths, one question, and three answers.
        </p>
        <div className="mt-14 animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25"
          >
            Begin your branches
          </Link>
        </div>
      </section>
    </div>
  );
}
