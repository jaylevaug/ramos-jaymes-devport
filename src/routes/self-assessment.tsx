import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { indicators, ratingScale } from "@/data/portfolio";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/self-assessment")({
  head: () => ({
    meta: [
      { title: "Self-Assessment Results — Developmental Portfolio" },
      {
        name: "description",
        content:
          "A comprehensive self-evaluation across five institutional outcomes and sixteen sub-indicators of teaching competence.",
      },
      { property: "og:title", content: "Self-Assessment Results — Developmental Portfolio" },
      {
        property: "og:description",
        content: "Year 1 self-assessment across 5 outcomes and 16 indicators.",
      },
    ],
  }),
  component: SelfAssessmentPage,
});

type Scores = Record<string, number | null>;

function SelfAssessmentPage() {
  const { isAdmin } = useAuth();
  const totalSubs = indicators.reduce((acc, i) => acc + i.subs.length, 0);
  const [scores, setScores] = useState<Scores>({});
  const ratedCount = Object.values(scores).filter((v) => typeof v === "number").length;
  const totalScore = Object.values(scores).reduce<number>(
    (acc, v) => acc + (typeof v === "number" ? v : 0),
    0,
  );
  const interpretation = getInterpretation(totalScore);

  useEffect(() => {
    let active = true;
    supabase
      .from("scores")
      .select("indicator_key, value")
      .then(({ data }) => {
        if (!active) return;
        const map: Scores = {};
        (data ?? []).forEach((r) => {
          map[r.indicator_key] = r.value;
        });
        setScores(map);
      });

    const channel = supabase
      .channel("scores")
      .on("postgres_changes", { event: "*", schema: "public", table: "scores" }, (payload) => {
        const row = (payload.new ?? payload.old) as { indicator_key: string; value?: number } | null;
        if (!row) return;
        setScores((prev) => {
          const next = { ...prev };
          if (payload.eventType === "DELETE") delete next[row.indicator_key];
          else next[row.indicator_key] = row.value ?? null;
          return next;
        });
      })
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const setScore = async (code: string, value: number | null) => {
    setScores((prev) => ({ ...prev, [code]: value }));
    if (value === null) {
      await supabase.from("scores").delete().eq("indicator_key", code);
    } else {
      await supabase
        .from("scores")
        .upsert(
          { indicator_key: code, value, updated_at: new Date().toISOString() },
          { onConflict: "indicator_key" },
        );
    }
  };

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-assessment py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Year 1 Assessment
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold text-foreground sm:text-6xl">
            Self-Assessment Results
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A comprehensive self-evaluation across five institutional outcomes and sixteen
            sub-indicators of teaching competence.
          </p>
        </div>
      </section>

      {/* TOPBAR */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <p className="text-sm">
            <span className="text-2xl font-semibold text-foreground">{ratedCount}</span>
            <span className="text-muted-foreground"> / {totalSubs} rated</span>
          </p>
          {isAdmin && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Admin mode — click a score to edit
            </span>
          )}
        </div>
      </div>

      {/* TABLE */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="bg-gradient-banner px-8 py-6 text-primary-foreground">
              <h2 className="font-display text-3xl font-bold">Institutional Outcomes Assessment</h2>
              <p className="mt-2 text-sm text-primary-foreground/80">
                1 – Not Yet Demonstrated &nbsp;|&nbsp; 2 – Occasionally Demonstrated &nbsp;|&nbsp; 3
                – Often Demonstrated &nbsp;|&nbsp; 4 – Consistently Demonstrated
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="w-56 px-6 py-4">Indicator</th>
                    <th className="w-20 px-3 py-4">Code</th>
                    <th className="px-6 py-4">Sub-Indicator</th>
                    <th className="w-32 px-6 py-4 text-center">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {indicators.map((ind) =>
                    ind.subs.map((sub, idx) => {
                      const current = scores[sub.code] ?? null;
                      return (
                        <tr
                          key={sub.code}
                          className="border-t border-border align-top transition-colors hover:bg-muted/30"
                        >
                          {idx === 0 && (
                            <td
                              rowSpan={ind.subs.length}
                              className="border-r border-border px-6 py-5 align-top"
                            >
                              <div className="flex items-start gap-3">
                                <span
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white ${ind.badgeColor}`}
                                >
                                  {ind.id}
                                </span>
                                <span className="font-semibold leading-snug text-foreground">
                                  {ind.name}
                                </span>
                              </div>
                            </td>
                          )}
                          <td className="px-3 py-5">
                            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                              {sub.code}
                            </span>
                          </td>
                          <td className="px-6 py-5 leading-relaxed text-muted-foreground">
                            {sub.text}
                          </td>
                          <td className="px-6 py-5 text-center">
                            {isAdmin ? (
                              <ScorePicker
                                value={current}
                                onChange={(v) => setScore(sub.code, v)}
                              />
                            ) : current === null ? (
                              <span className="text-2xl font-light text-muted-foreground/40">—</span>
                            ) : (
                              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground shadow-soft">
                                {current}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    }),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* INTERPRETATION */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center font-display text-4xl font-bold text-foreground">
            Summary Interpretation
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            The summary score helps you understand your current stage in the continuum of
            professional development. This interpretation is designed to support your reflection and
            guide your personal and career growth. It is intended not just as a scoring tool but as
            a guide for your reflective growth and professional self-awareness as an aspiring
            professional. The interpretation of scores should be approached as a developmental
            guide for you rather than a summative judgment of your Year 1 career in the University.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-[1fr_2fr]">
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Score
              </p>
              <p className="mt-3 font-display text-6xl font-bold text-primary">
                {totalScore}
                <span className="text-2xl font-medium text-muted-foreground">/64</span>
              </p>
              {interpretation && (
                <p className="mt-4 inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                  {interpretation.stage} Stage
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
              {interpretation ? (
                <>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {interpretation.stage}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Score Range: {interpretation.range}
                  </p>
                  <p className="mt-4 leading-relaxed text-foreground">
                    {interpretation.text}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Once enough sub-indicators are rated, the corresponding stage and interpretation
                  will appear here.
                </p>
              )}
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Score Range</th>
                  <th className="px-6 py-3">Stage</th>
                  <th className="px-6 py-3">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {interpretationTable.map((row) => {
                  const active = interpretation?.stage === row.stage;
                  return (
                    <tr
                      key={row.stage}
                      className={cn(
                        "border-t border-border align-top",
                        active && "bg-primary/5",
                      )}
                    >
                      <td className="px-6 py-4 font-semibold text-foreground">{row.range}</td>
                      <td className="px-6 py-4 font-semibold text-foreground">{row.stage}</td>
                      <td className="px-6 py-4 leading-relaxed text-muted-foreground">
                        {row.text}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* RATING SCALE */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-display text-4xl font-bold text-foreground">
            Rating Scale
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ratingScale.map((r) => (
              <div
                key={r.score}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-display text-3xl font-bold text-primary">
                  {r.score}
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  {r.label}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-foreground">Explore the Evidence</h2>
          <p className="mt-4 text-muted-foreground">
            See the artifacts and reflections that demonstrate my growth across all indicators.
          </p>
          <Link
            to="/evidence-reflections"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-all hover:scale-[1.02] hover:bg-primary/90"
          >
            View Evidence & Reflections <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ScorePicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4].map((n) => (
        <button
          key={n}
          onClick={() => onChange(value === n ? null : n)}
          className={cn(
            "h-8 w-8 rounded-full border text-sm font-semibold transition-all",
            value === n
              ? "border-primary bg-primary text-primary-foreground shadow-soft"
              : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
          )}
          aria-label={`Set score ${n}`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

type InterpretationRow = { range: string; stage: string; min: number; max: number; text: string };

const interpretationTable: InterpretationRow[] = [
  {
    range: "16–24",
    stage: "Exploring",
    min: 16,
    max: 24,
    text: "You are still discovering what it means to be a future teacher. It's normal to feel uncertain. At this stage, ask questions, seek guidance, and reflect on why you want to teach.",
  },
  {
    range: "25–40",
    stage: "Emerging",
    min: 25,
    max: 40,
    text: "You are starting to connect with the teaching profession. You show growing interest and awareness of your role. Keep building confidence, learning from experiences, and clarifying your purpose.",
  },
  {
    range: "41–56",
    stage: "Consolidating",
    min: 41,
    max: 56,
    text: "You are consistently engaged and committed to becoming a teacher. You show responsibility, creativity, and openness to growth. Use this stage to set goals and keep strengthening your skills.",
  },
  {
    range: "57–64",
    stage: "Building",
    min: 57,
    max: 64,
    text: "You show strong alignment with the values and mindset of teaching. You demonstrate leadership, ethical awareness, and readiness to contribute to others' growth. You are preparing with clear purpose for your future career.",
  },
];

function getInterpretation(score: number): InterpretationRow | null {
  if (score < 16) return null;
  return interpretationTable.find((r) => score >= r.min && score <= r.max) ?? null;
}
