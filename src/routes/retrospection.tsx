import { createFileRoute } from "@tanstack/react-router";
import { EditableText } from "@/components/EditableText";

export const Route = createFileRoute("/retrospection")({
  head: () => ({
    meta: [
      { title: "Overall Retrospection — Jaymes Merc Lebron Ramos" },
      {
        name: "description",
        content:
          "An overall retrospection on my first year of growth and learning as an aspiring mathematics educator.",
      },
      { property: "og:title", content: "Overall Retrospection — Jaymes Merc Lebron Ramos" },
      {
        property: "og:description",
        content: "Reflecting on my first year of growth and learning.",
      },
    ],
  }),
  component: RetrospectionPage,
});

function RetrospectionPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <EditableText
          storageKey="home.retro.eyebrow"
          defaultValue="Reflection"
          placeholder="Eyebrow"
          paragraphClassName="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
        />
        <EditableText
          storageKey="home.retro.heading"
          defaultValue="Overall Retrospection"
          as="h2"
          placeholder="Section heading"
          paragraphClassName="mt-4 font-display text-4xl font-bold text-foreground sm:text-5xl"
        />
        <EditableText
          storageKey="home.retro.subheading"
          defaultValue="Reflecting on my first year of growth and learning"
          placeholder="Section subheading"
          className="mt-4"
          paragraphClassName="text-muted-foreground"
        />
        <EditableText
          storageKey="home.retro.body"
          multiline
          defaultValue=""
          placeholder="Share your overall retrospection"
          className="mt-12 text-left"
          paragraphClassName="mb-6 text-base leading-relaxed text-muted-foreground sm:text-lg"
        />
      </div>
    </section>
  );
}
