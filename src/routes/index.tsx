import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Quote, Maximize2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCloudText } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jaymes Merc Lebron Ramos — Developmental Portfolio" },
      {
        name: "description",
        content:
          "Hi, I'm Jaymes Merc Lebron Ramos — an aspiring mathematics educator. Explore my teaching philosophy, principles, and growth.",
      },
      { property: "og:title", content: "Jaymes Merc Lebron Ramos — Developmental Portfolio" },
      {
        property: "og:description",
        content: "An aspiring mathematics educator's first-year journey of growth and reflection.",
      },
    ],
  }),
  component: HomePage,
});

const ROLES = ["a digital literate and date-driven decision maker", "a design thinker and innovator", "a discerning and compassionate person", "a dynamic lifelong learner and leader", "a deeply-rooted global citizen", "a proud PNUan", "a future-ready teacher"];

function Typewriter() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = ROLES[index];
    const speed = deleting ? 40 : 80;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = word.slice(0, text.length + 1);
        setText(next);
        if (next === word) setTimeout(() => setDeleting(true), 1500);
      } else {
        const next = word.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setIndex((i) => (i + 1) % ROLES.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, index]);

  return <span className="cursor-blink text-primary">{text}</span>;
}

const PRINCIPLES = [
  {
    storageKey: "home.principle.1",
    defaultTitle: "Student-Centered Learning",
    tone: "bg-[oklch(0.95_0.04_265)] text-primary",
  },
  {
    storageKey: "home.principle.2",
    defaultTitle: "Collaborative Growth",
    tone: "bg-[oklch(0.95_0.04_295)] text-[oklch(0.5_0.2_295)]",
  },
  {
    storageKey: "home.principle.3",
    defaultTitle: "Real-World Connections",
    tone: "bg-[oklch(0.95_0.04_150)] text-[oklch(0.45_0.18_150)]",
  },
  {
    storageKey: "home.principle.4",
    defaultTitle: "Inclusive Excellence",
    tone: "bg-[oklch(0.95_0.04_60)] text-[oklch(0.45_0.18_60)]",
  },
];

function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 -z-10 opacity-50">
          <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[oklch(0.7_0.18_295)]/10 blur-3xl" />
        </div>
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
          <p className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Hi, I'm
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.05] text-foreground sm:text-7xl md:text-8xl">
            Jaymes Merc <br className="hidden sm:block" /> Lebron Ramos
          </h1>
          <p className="mt-10 text-lg text-muted-foreground sm:text-xl">I am</p>
          <p className="mt-2 min-h-[2em] text-2xl font-semibold sm:text-3xl">
            <Typewriter />
          </p>
          <a
            href="#philosophy"
            className="mt-12 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-all hover:scale-[1.02] hover:bg-primary/90"
          >
            Discover my journey <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* PHILOSOPHY — image left, text right */}
      <section id="philosophy" className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <EditableImage
              storageKey="home.philosophy.image"
              alt="Portrait of the educator"
              className="aspect-[4/5] w-full"
              emptyLabel="Add your portrait"
            />
            <div>
              <EditableText
                storageKey="home.philosophy.eyebrow"
                defaultValue="My Teaching Philosophy"
                placeholder="Eyebrow"
                paragraphClassName="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
              />
              <EditableText
                storageKey="home.philosophy.heading"
                defaultValue="My Becoming of a Student-Centered Teacher"
                as="h2"
                placeholder="Section heading"
                paragraphClassName="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl"
              />
              <EditableText
                storageKey="home.philosophy.body"
                multiline
                defaultValue=""
                placeholder="Share your teaching philosophy here"
                className="mt-8"
                paragraphClassName="mb-5 text-base leading-relaxed text-muted-foreground sm:text-lg"
              />
              <figure className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
                <Quote className="h-7 w-7 text-primary" />
                <EditableText
                  storageKey="home.philosophy.quote"
                  defaultValue=""
                  placeholder="Add your guiding quote"
                  as="p"
                  paragraphClassName="mt-3 font-display text-xl italic leading-snug text-foreground sm:text-2xl"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT PORTFOLIO */}
      <section className="bg-muted/40 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <EditableText
            storageKey="home.purpose.eyebrow"
            defaultValue="About This Portfolio"
            placeholder="Eyebrow"
            paragraphClassName="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
          />
          <EditableText
            storageKey="home.purpose.heading"
            defaultValue="Purpose of This Portfolio"
            as="h2"
            placeholder="Section heading"
            paragraphClassName="mt-4 font-display text-4xl font-bold text-foreground sm:text-5xl"
          />
          <EditableText
            storageKey="home.purpose.body"
            multiline
            defaultValue=""
            placeholder="Describe the purpose of this portfolio"
            className="mt-10 text-left"
            paragraphClassName="mb-5 text-base leading-relaxed text-muted-foreground sm:text-lg"
          />
        </div>
      </section>

      {/* CORE BELIEFS */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <EditableText
              storageKey="home.beliefs.eyebrow"
              defaultValue="Core Beliefs"
              placeholder="Eyebrow"
              paragraphClassName="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
            />
            <EditableText
              storageKey="home.beliefs.heading"
              defaultValue="My Emerging Educational Guiding Principles"
              as="h2"
              placeholder="Section heading"
              paragraphClassName="mt-4 font-display text-4xl font-bold text-foreground sm:text-5xl"
            />
            <EditableText
              storageKey="home.beliefs.intro"
              defaultValue=""
              placeholder="Add an introduction for your core beliefs"
              className="mx-auto mt-6 max-w-2xl"
              paragraphClassName="text-base text-muted-foreground"
            />
          </div>

          <BeliefsGrid />

        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            Explore My Journey
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Discover the evidence and reflections that document my development as a mathematics
            educator.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/self-assessment"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-all hover:scale-[1.02] hover:bg-primary/90"
            >
              Self-Assessment Results <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/evidence-reflections"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground shadow-soft transition-all hover:bg-accent"
            >
              Evidence & Reflections <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function BeliefCardContent({ storageKey, defaultTitle }: { storageKey: string; defaultTitle: string }) {
  return (
    <>
      <EditableText
        storageKey={`${storageKey}.title`}
        defaultValue={defaultTitle}
        as="h3"
        placeholder="Belief title"
        paragraphClassName="font-display text-2xl font-semibold text-foreground"
      />
      <EditableText
        storageKey={`${storageKey}.body`}
        defaultValue=""
        multiline
        placeholder="Describe this belief"
        className="mt-3"
        paragraphClassName="mb-3 leading-relaxed text-muted-foreground"
      />
    </>
  );
}

function BeliefZoomBody({ storageKey, defaultTitle }: { storageKey: string; defaultTitle: string }) {
  const { value: title } = useCloudText(`${storageKey}.title`, defaultTitle);
  const { value: body } = useCloudText(`${storageKey}.body`, "");
  const paragraphs = body.split(/\n+/).filter((p) => p.trim().length > 0);
  return (
    <div className="px-2 py-4 sm:px-6 sm:py-6">
      <h3 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
        {title || defaultTitle}
      </h3>
      <div className="mt-6 space-y-4">
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {p}
            </p>
          ))
        ) : (
          <p className="text-base italic text-muted-foreground/70">No description yet.</p>
        )}
      </div>
    </div>
  );
}

function BeliefsGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;
  const current = openIndex !== null ? PRINCIPLES[openIndex] : null;

  const next = () => setOpenIndex((i) => (i === null ? 0 : (i + 1) % PRINCIPLES.length));
  const prev = () =>
    setOpenIndex((i) =>
      i === null ? 0 : (i - 1 + PRINCIPLES.length) % PRINCIPLES.length,
    );

  return (
    <>
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <div
            key={p.storageKey}
            className="group relative rounded-2xl border border-border bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Zoom into ${p.defaultTitle}`}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground opacity-70 backdrop-blur transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground hover:opacity-100"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <BeliefCardContent storageKey={p.storageKey} defaultTitle={p.defaultTitle} />
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-w-3xl overflow-hidden border-border bg-card p-0 sm:rounded-3xl"
        >
          {current && (
            <div className="animate-scale-in">
              <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Core Belief {(openIndex ?? 0) + 1} / {PRINCIPLES.length}
                </span>
                <button
                  type="button"
                  onClick={() => setOpenIndex(null)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <BeliefZoomBody
                key={current.storageKey}
                storageKey={current.storageKey}
                defaultTitle={current.defaultTitle}
              />
              <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-3 sm:px-6">
                <button
                  type="button"
                  onClick={prev}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-accent"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elevated transition-all hover:scale-[1.02] hover:bg-primary/90"
                >
                  Next belief <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

