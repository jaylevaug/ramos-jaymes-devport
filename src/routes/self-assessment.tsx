import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { indicators, ratingScale } from "@/data/portfolio";
import { useAuth } from "@/lib/auth";
import { useLocalStorage } from "@/lib/storage";
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
  const [scores, setScores] = useLocalStorage<Scores>("portfolio.scores", {});
  const ratedCount = Object.values(scores).filter((v) => typeof v === "number").length;

  const setScore = (code: string, value: number | null) => {
    setScores((prev) => ({ ...prev, [code]: value }));
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

      {/* RATING SCALE */}
      <section className="bg-muted/40 py-20">
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
      <section className="py-20">
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
