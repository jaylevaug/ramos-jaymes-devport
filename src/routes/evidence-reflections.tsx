import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ImagePlus, ShieldCheck } from "lucide-react";
import { indicators } from "@/data/portfolio";

export const Route = createFileRoute("/evidence-reflections")({
  head: () => ({
    meta: [
      { title: "Evidence & Reflections — Developmental Portfolio" },
      {
        name: "description",
        content:
          "Browse evidence and self-reflections across 5 indicators and 16 sub-indicators of teaching competence.",
      },
      { property: "og:title", content: "Evidence & Reflections — Developmental Portfolio" },
      {
        property: "og:description",
        content: "Click any sub-indicator card to view its evidence feed and self-reflections.",
      },
    ],
  }),
  component: EvidencePage,
});

type Card = {
  code: string;
  short: string;
  text: string;
  cardClass: string;
  indicatorId: number;
};

function EvidencePage() {
  const [filter, setFilter] = useState<number | "all">("all");

  const cards = useMemo<Card[]>(() => {
    return indicators.flatMap((ind) =>
      ind.subs.map((s) => ({
        code: s.code,
        text: s.text,
        short: ind.short,
        cardClass: ind.cardClass,
        indicatorId: ind.id,
      })),
    );
  }, []);

  const visible = filter === "all" ? cards : cards.filter((c) => c.indicatorId === filter);
  const totalSubs = cards.length;

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-evidence py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block rounded-full bg-[oklch(0.65_0.21_20)]/15 px-4 py-1.5 text-sm font-medium text-[oklch(0.55_0.21_20)]">
            5 Indicators &nbsp;|&nbsp; {totalSubs} Sub-Indicators
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold text-foreground sm:text-6xl">
            Evidence & Reflections
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Click any sub-indicator card to view its evidence feed and self-reflections.
          </p>
        </div>
      </section>

      {/* TOPBAR */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-end px-6 py-5">
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent">
            <ShieldCheck className="h-4 w-4" /> Admin Login
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 px-6 py-6">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} dark>
            All
          </FilterChip>
          {indicators.map((ind) => (
            <FilterChip
              key={ind.id}
              active={filter === ind.id}
              onClick={() => setFilter(ind.id)}
            >
              Indicator {ind.id}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* GRID */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((c) => (
              <article
                key={c.code}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <div
                  className={`relative flex aspect-[4/5] items-center justify-center ${c.cardClass}`}
                >
                  <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-foreground shadow-soft">
                    {c.code}
                  </span>
                  <div className="flex flex-col items-center gap-3 text-white/90">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <ImagePlus className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">No evidence yet</span>
                  </div>
                </div>
                <div className="p-5">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${c.cardClass}`}
                  >
                    {c.short}
                  </span>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {c.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
  dark,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  dark?: boolean;
}) {
  const base = "rounded-full px-5 py-2 text-sm font-medium transition-all";
  if (active) {
    return (
      <button
        onClick={onClick}
        className={`${base} ${dark ? "bg-foreground text-background" : "bg-primary text-primary-foreground"} shadow-soft`}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`${base} bg-muted text-muted-foreground hover:bg-accent hover:text-foreground`}
    >
      {children}
    </button>
  );
}
