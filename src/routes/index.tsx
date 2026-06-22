import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Quote } from "lucide-react";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";

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
                storageKey="home.philosophy.body"
                multiline
                defaultValue="According to the news article of PhilStar Ngayon (2024), Filipino learners ranked 76th out of 81 countries in the Programme for International Student Assessment (PISA). This is not merely a statistic; rather, it reflects the challenges and shortcomings of the Philippine educational system. Therefore, it is important to construct an education system that promotes a Filipino student-centered curriculum and learning process.

In order for a learner to become proficient in a subject, an educator must first know how to teach concepts in a way that students can understand. There are many barriers to lesson comprehension, such as the complexity of the concepts being taught. However, low comprehension can be alleviated when teachers use a language that students understand. In the Philippines, especially in basic education, most subjects are taught in English, textbooks are written in English, and there are even existing policies that encourage students to communicate only in English. Although there is a transition phase from the learners' mother tongue to the English language in formal education, it remains insufficient because (1) the transition period is relatively short, and (2) most Filipinos, if not all, primarily use Filipino as a medium of communication in their households. The use of Filipino and student-friendly language does not deconstruct the formality of education; rather, it improves the learning outcomes of Filipino students.

Most Filipino students do not fully appreciate concepts because they often learn them only in theory and not in practice. For example, students may learn the parts of a microscope and be taught how to use it, but they may not fully appreciate the concept because they have not had the opportunity to actually observe and handle a microscope. While I acknowledge that there are existing challenges in school funding, I propose the use of online simulators and other digital learning tools. Through these resources, learners can better appreciate the concepts being taught to them. Consequently, when the time comes for them to immerse themselves in their respective fields, they will already have a foundational understanding of how to perform such tasks and apply their knowledge effectively.

Instead of relying solely on tests that evaluate how well learners memorize information from their textbooks, I suggest the use of assessments that allow students to demonstrate their understanding through projects, whether in the form of a concept paper, research study, prototype, or performance task. If a teacher still wishes to administer examinations, these should be situational and reflective in nature so that they genuinely assess the students' learning and understanding rather than their ability to memorize information."
                placeholder="Share your teaching philosophy here"
                paragraphClassName="text-base leading-relaxed text-muted-foreground sm:text-lg"
              />
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

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {PRINCIPLES.map(({ storageKey, defaultTitle }) => (
              <div
                key={storageKey}
                className="group rounded-2xl border border-border bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
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
              </div>
            ))}
          </div>
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
              Explore my Evidences <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/retrospection"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground shadow-soft transition-all hover:bg-accent"
            >
              Explore my Overall Reflection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
