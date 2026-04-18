export type Indicator = {
  id: number;
  name: string;
  short: string;
  cardClass: string;
  badgeColor: string;
  subs: { code: string; text: string }[];
};

export const indicators: Indicator[] = [
  {
    id: 1,
    name: "Digital Literate and Data-Driven Decision Maker",
    short: "Digital Literate & Data-Driven",
    cardClass: "bg-card-1",
    badgeColor: "bg-[oklch(0.65_0.16_220)]",
    subs: [
      { code: "1.1", text: "I have used basic digital tools (e.g., Word, Excel, learning platforms) to complete my GE coursework, submitting at least 90% of outputs on time with at least a satisfactory rating." },
      { code: "1.2", text: "I have presented my outputs in an organized, purposeful and meaningful way across my GE courses, meeting the agreed criteria and achieving at least a satisfactory rating." },
      { code: "1.3", text: "I have demonstrated responsible and ethical use of digital platforms (e.g., online forums, cloud storage, social media) for collaboration in my GE courses, upholding academic integrity and meeting the agreed criteria." },
      { code: "1.4", text: "I have reflected on how my use of data and digital tools has contributed to my professional identity and competence, and how these experiences have shaped my future-ready teaching practices, by preparing portfolio entries throughout the academic year, meeting the agreed criteria." },
    ],
  },
  {
    id: 2,
    name: "Design Thinker and Innovator",
    short: "Design Thinker & Innovator",
    cardClass: "bg-card-2",
    badgeColor: "bg-[oklch(0.65_0.2_295)]",
    subs: [
      { code: "2.1", text: "I have applied creative and critical thinking to solve at least two interdisciplinary or cross-GE problems, as shown in outputs or activities evaluated with at least a satisfactory rating." },
      { code: "2.2", text: "I have produced at least two original or adapted academic outputs (visual, multimedia, or models) in GE courses that show innovative and thoughtful design, meeting the agreed criteria and earning at least a satisfactory rating." },
      { code: "2.3", text: "I have reflected on how innovation enhances future teaching practices and learner engagement by preparing portfolio entries throughout the academic year, meeting the agreed criteria." },
    ],
  },
  {
    id: 3,
    name: "Discerning and Compassionate Person",
    short: "Discerning & Compassionate",
    cardClass: "bg-card-3",
    badgeColor: "bg-[oklch(0.65_0.21_20)]",
    subs: [
      { code: "3.1", text: "I have completed a self-assessment during the academic year reflecting on my thoughts, feelings, and academic journey with empathy, respect, and ethical judgment, covering my learning and experiences in my GE courses as evaluated through an agreed rubric." },
      { code: "3.2", text: "I have communicated my principles and ethical beliefs with respect and sensitivity in class discussions, group activities, and presentations, and documented these experiences in written outputs, earning at least a satisfactory rating." },
      { code: "3.3", text: "I have reflected on the role of compassion and discernment in becoming a responsible, future-ready teacher by preparing portfolio entries throughout the academic year, meeting the agreed criteria." },
    ],
  },
  {
    id: 4,
    name: "Dynamic Lifelong Learner and Leader",
    short: "Lifelong Learner & Leader",
    cardClass: "bg-card-4",
    badgeColor: "bg-[oklch(0.65_0.17_150)]",
    subs: [
      { code: "4.1", text: "I have set goals and sought learning opportunities to improve my personal and academic development by preparing and reviewing a personal development plan at the start, midyear, and end of the academic year, documenting at least two learning opportunities pursued." },
      { code: "4.2", text: "I have contributed to individual and group tasks, showing initiative and openness to feedback, as evaluated by peers or faculty each trimester with at least a satisfactory rating." },
      { code: "4.3", text: "I have reflected on how habits of continuous learning prepare me for the teaching profession by preparing portfolio entries throughout the academic year, meeting the agreed criteria." },
    ],
  },
  {
    id: 5,
    name: "Deeply-rooted Global Citizen",
    short: "Deeply-rooted Global Citizen",
    cardClass: "bg-card-5",
    badgeColor: "bg-[oklch(0.65_0.18_60)]",
    subs: [
      { code: "5.1", text: "I have participated in global or intercultural activities, discussions, or projects in my GE courses, demonstrating respect for diverse systems, cultures, and issues as shown in rubric-based evaluations." },
      { code: "5.2", text: "I have demonstrated openness to diverse cultural and social perspectives in community service or intercultural dialogues in my GE courses, as reflected in peer and faculty evaluations." },
      { code: "5.3", text: "I have reflected on how I embrace my responsibility of being globally aware and locally responsive in preparing for future teaching by preparing portfolio entries throughout the academic year, meeting the agreed criteria." },
    ],
  },
];

export const ratingScale = [
  { score: 1, label: "Not Yet Demonstrated", desc: "Limited or emerging evidence of the indicator." },
  { score: 2, label: "Occasionally Demonstrated", desc: "Indicator is shown in some situations." },
  { score: 3, label: "Often Demonstrated", desc: "Consistent evidence across multiple contexts." },
  { score: 4, label: "Consistently Demonstrated", desc: "Strong, sustained evidence in all relevant contexts." },
];
