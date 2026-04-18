import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Mouse, Quote, Users, Sparkles, Globe2, HeartHandshake } from "lucide-react";

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

const ROLES = ["Digital Literate Educator", "Future Math Teacher", "Lifelong Learner", "Reflective Practitioner"];

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
          <div className="mt-20 flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs">Discover my journey</span>
            <Mouse className="h-5 w-5 animate-bounce" />
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section id="philosophy" className="border-t border-border py-24">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            My Teaching Philosophy
          </p>
          <h2 className="mt-4 text-center font-display text-4xl font-bold text-foreground sm:text-5xl">
            My Becoming of a <br className="hidden sm:block" />
            <span className="text-primary">Student-Centered Teacher</span>
          </h2>
          <div className="mt-12 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Mathematics has always been more than just numbers and equations to me — it's a
              universal language that unlocks critical thinking and problem-solving abilities in
              every learner. As an aspiring educator, I believe my role extends far beyond teaching
              formulas; I'm here to ignite curiosity and build confidence in every student who walks
              into my classroom.
            </p>
            <p>
              My journey into education stems from a deep conviction that every student can succeed
              in mathematics with the right guidance, patience, and encouragement. I am committed to
              creating inclusive learning environments where mistakes become stepping stones to
              understanding, and where each student's unique perspective contributes to our
              collective discovery of mathematical beauty.
            </p>
          </div>
          <figure className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-card">
            <Quote className="h-8 w-8 text-primary" />
            <blockquote className="mt-4 font-display text-2xl italic leading-snug text-foreground sm:text-3xl">
              "To teach mathematics is to open minds to endless possibilities."
            </blockquote>
          </figure>
        </div>
      </section>

      {/* ABOUT PORTFOLIO */}
      <section className="bg-muted/40 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            About This Portfolio
          </p>
          <h2 className="mt-4 text-center font-display text-4xl font-bold text-foreground sm:text-5xl">
            Purpose of This Portfolio
          </h2>
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              This developmental portfolio serves as a comprehensive documentation of my journey
              through the first year of my education program. It showcases my growth across five
              institutional outcomes and sixteen specific indicators of teaching competence.
            </p>
            <p>
              Through carefully selected artifacts, reflections, and assessments, this portfolio
              demonstrates my evolving understanding of effective mathematics instruction, my
              commitment to student-centered learning, and my dedication to continuous professional
              growth. It is both a celebration of achievements and an honest acknowledgment of areas
              where I continue to develop.
            </p>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Core Beliefs
          </p>
          <h2 className="mt-4 text-center font-display text-4xl font-bold text-foreground sm:text-5xl">
            My Emerging Educational <br className="hidden sm:block" />
            <span className="text-primary">Guiding Principles</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-muted-foreground">
            These principles guide my approach to teaching mathematics and shape every decision I
            make in the classroom.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {[
              {
                Icon: Users,
                title: "Student-Centered Learning",
                body: "Every student deserves personalized attention and teaching methods that cater to their unique learning styles and mathematical abilities.",
                tone: "bg-[oklch(0.95_0.04_265)] text-primary",
              },
              {
                Icon: HeartHandshake,
                title: "Collaborative Growth",
                body: "Mathematics is best learned through collaboration, peer discussion, and shared problem-solving experiences.",
                tone: "bg-[oklch(0.95_0.04_295)] text-[oklch(0.5_0.2_295)]",
              },
              {
                Icon: Globe2,
                title: "Real-World Connections",
                body: "Mathematical concepts become meaningful when connected to real-life applications and everyday situations.",
                tone: "bg-[oklch(0.95_0.04_150)] text-[oklch(0.45_0.18_150)]",
              },
              {
                Icon: Sparkles,
                title: "Inclusive Excellence",
                body: "Creating an inclusive classroom where every student feels valued, supported, and capable of mathematical success.",
                tone: "bg-[oklch(0.95_0.04_60)] text-[oklch(0.45_0.18_60)]",
              },
            ].map(({ Icon, title, body, tone }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">{title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RETROSPECTION */}
      <section className="bg-muted/40 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Reflection
          </p>
          <h2 className="mt-4 text-center font-display text-4xl font-bold text-foreground sm:text-5xl">
            Overall Retrospection
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            Reflecting on my first year of growth and learning
          </p>

          <div className="mt-12 space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              My first year in this developmental program has been transformative, challenging me to
              grow both personally and professionally. I entered this program with a passion for
              mathematics and a desire to teach, but I quickly learned that effective teaching
              requires much more than content knowledge. Through coursework, field experiences, and
              countless hours of reflection, I have developed a deeper understanding of what it
              means to be an educator.
            </p>
            <p>
              The self-assessment process revealed both my strengths and areas for continued growth.
              I am proud of my ability to create inclusive learning environments where all students
              feel valued and capable of mathematical success. However, I recognize that I need to
              continue developing my assessment literacy, particularly in designing and implementing
              formative assessments that truly inform my instruction.
            </p>
            <p>
              The evidence I have collected throughout this year tells the story of my evolution as
              a teacher. Each artifact represents not just a completed assignment, but a moment of
              learning and growth. I have learned to embrace feedback as a gift rather than
              criticism, and to view challenges as opportunities for growth rather than obstacles to
              success.
            </p>
            <p>
              Looking ahead to my second year and beyond, I am excited to continue developing as a
              mathematics educator. I am committed to maintaining the reflective practice that has
              been so central to my growth this year — becoming an excellent teacher is a lifelong
              journey, and I am grateful for the strong foundation this first year has provided.
            </p>
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
              Evidence & Reflections <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
