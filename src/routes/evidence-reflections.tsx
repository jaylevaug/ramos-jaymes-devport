import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ImagePlus } from "lucide-react";
import { indicators } from "@/data/portfolio";
import { EvidenceFeedModal } from "@/components/EvidenceFeedModal";
import { toDriveThumbnail } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { TopProgressBar } from "@/components/TopProgressBar";

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

function CardThumb({
  code,
  cardClass,
  onLoadingChange,
}: {
  code: string;
  cardClass: string;
  onLoadingChange?: (loading: boolean) => void;
}) {
  const [count, setCount] = useState<number | null>(null);
  const [latestUrl, setLatestUrl] = useState<string>("");
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    onLoadingChange?.(true);
    const load = async () => {
      const { data, count: c } = await supabase
        .from("posts")
        .select("media_url", { count: "exact" })
        .eq("indicator_key", code)
        .order("created_at", { ascending: false })
        .limit(1);
      if (!active) return;
      setCount(c ?? 0);
      setLatestUrl(data?.[0]?.media_url ?? "");
      onLoadingChange?.(false);
    };
    load();
    const channel = supabase
      .channel(`thumb:${code}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts", filter: `indicator_key=eq.${code}` },
        () => load(),
      )
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const thumb = latestUrl ? toDriveThumbnail(latestUrl, 800) : "";
  const hasPosts = (count ?? 0) > 0;
  const isInitialLoading = count === null;

  if (isInitialLoading) {
    return (
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
        <span className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-foreground shadow-soft">
          {code}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative aspect-[4/5] overflow-hidden ${hasPosts ? "bg-black" : `flex items-center justify-center ${cardClass}`}`}>
      <span className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-foreground shadow-soft">
        {code}
      </span>
      {hasPosts && thumb ? (
        <>
          {!imgLoaded && <Skeleton className="absolute inset-0 h-full w-full rounded-none" />}
          <img
            src={thumb}
            alt={`Latest evidence for ${code}`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
          {count !== null && count > 1 && (
            <span className="absolute bottom-3 right-3 z-10 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {count} evidences
            </span>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 text-white/95">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <ImagePlus className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium">No evidence yet</span>
        </div>
      )}
    </div>
  );
}

function EvidencePage() {
  const [filter, setFilter] = useState<number | "all">("all");
  const [activeCard, setActiveCard] = useState<Card | null>(null);

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
              <button
                key={c.code}
                onClick={() => setActiveCard(c)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <CardThumb code={c.code} cardClass={c.cardClass} />
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
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeCard && (
        <EvidenceFeedModal
          open={!!activeCard}
          onOpenChange={(o) => !o && setActiveCard(null)}
          subCode={activeCard.code}
          subText={activeCard.text}
          indicatorShort={activeCard.short}
          cardClass={activeCard.cardClass}
        />
      )}
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
