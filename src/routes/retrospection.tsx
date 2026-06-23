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
          defaultValue={`Looking back on my first year as an aspiring mathematics educator, my growth can best be understood through the guiding principles that quietly shaped every output, reflection, and collaboration I produced — Student-Centered Learning, Collaborative Growth, Real-World Connections, and Inclusive Excellence. These principles did not stand apart from my experiences; they emerged from them, and weaving them together with my retrospection reveals the kind of teacher I am becoming.

Student-Centered Learning became real to me the moment I stopped treating my General Education tasks as requirements and began treating them as rehearsals for teaching. Through my UTS Buddy Talks, my Teaching Profession reflections, and my PATHFit tracking, I learned that meaningful learning starts with knowing the learner — their context, language, and lived experience. My teaching philosophy grew from this same insight: that Filipino learners deserve a classroom that meets them where they are, not one that asks them to translate themselves before they can think.

Collaborative Growth was the principle I felt most deeply, because almost none of my best work was made alone. The GAS Symposium, the case analyses in TP and FSIE, the Pearson R news-casting in MMW, and the podcast in PC all reminded me that competence is co-constructed. I learned to listen before I led, to give feedback without diminishing a peer, and to receive critique as a gift rather than a verdict. This is the version of myself I want to carry into my future classroom — a teacher who models the kind of collaboration he hopes to see in his students.

Real-World Connections gave my learning its weight. The microscope example in my teaching philosophy is not abstract for me; it is the same realization I had when I used digital simulators, tracked my own sleep and nutrition data, and analyzed actual court cases in Teaching Profession. Concepts only become knowledge when learners can touch them, test them, and tie them to a world they recognize. My evidences across the four indicators show a slow but steady shift from memorizing content to applying it — and that shift is exactly what I want to design for my own future students.

Inclusive Excellence is the principle I am still growing into, and my retrospection is most honest here. The intercultural dialogues in PC, the case studies in FSIE, and my own reflections in UTS taught me that excellence without inclusion is just performance. I am learning to hold high standards and wide doors at the same time — to expect much from every learner while making sure the path to that excellence is reachable, especially for those whose first language, learning pace, or circumstances do not match the default classroom.

If I were to name the throughline of this first year, it would be this: I came in wanting to become a competent teacher, and I am leaving the year wanting to become a thoughtful one. The five indicators gave me a map; the four guiding principles gave me a compass; and the evidences I gathered gave me proof that the two can move together. There is still much I have not yet demonstrated consistently — and that, more than anything, is what keeps me committed to the next year of becoming.`}
          placeholder="Share your overall retrospection"
          className="mt-12 text-left"
          paragraphClassName="mb-6 text-base leading-relaxed text-muted-foreground sm:text-lg"
        />
      </div>
    </section>
  );
}
