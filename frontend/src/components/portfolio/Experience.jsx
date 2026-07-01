import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const timeline = [
  {
    period: "2024 — Present",
    role: "Principal Systems & AI Engineer",
    company: "Independent",
    notes: [
      "Design and build platform-scale AI infrastructure for select partners.",
      "Advise on distributed architecture, retrieval systems, and automation.",
    ],
  },
  {
    period: "2022 — 2024",
    role: "Senior Software Engineer, Platform",
    company: "Confidential · FinTech",
    notes: [
      "Led migration to event-driven multi-region architecture. Latency ↓ 62%.",
      "Introduced internal AI copilots for ops — 3.2× faster incident resolution.",
    ],
  },
  {
    period: "2020 — 2022",
    role: "Software Engineer, Automation",
    company: "SaaS · Series C",
    notes: [
      "Owned workflow orchestration platform serving 12k+ automations daily.",
      "Built the guardrails, retries, and audit layer teams still trust in prod.",
    ],
  },
  {
    period: "2018 — 2020",
    role: "Software Engineer",
    company: "Product Studio",
    notes: [
      "Full-stack across a portfolio of consumer & B2B products.",
      "Discovered a love for the parts of engineering that go unseen.",
    ],
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      data-testid="experience-section"
      className="relative py-24 md:py-40 max-container"
    >
      <SectionHeader
        index="04"
        eyebrow="Journey"
        title={
          <>
            A path, <span className="italic text-gold-gradient">quietly walked</span>.
          </>
        }
        subtitle="Selected chapters. The through-line is the same: build things that outlast the launch."
      />

      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[rgba(212,175,55,0.35)] to-transparent" />
        <div className="space-y-14 md:space-y-24">
          {timeline.map((t, i) => (
            <motion.div
              key={t.period}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-start"
            >
              {/* dot */}
              <span className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-2 h-3 w-3 rounded-full bg-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.6)]" />

              <div className={`pl-10 md:pl-0 ${i % 2 ? "md:order-2 md:pl-16" : "md:text-right md:pr-16"}`}>
                <div className="font-mono-accent text-[11px] uppercase tracking-[0.28em] text-[#F2DDB6]">
                  {t.period}
                </div>
                <h3 className="mt-3 font-serif-display text-2xl md:text-3xl text-white">
                  {t.role}
                </h3>
                <div className="mt-1 text-zinc-400 italic">{t.company}</div>
              </div>
              <div className={`pl-10 md:pl-0 ${i % 2 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                <ul className="space-y-3">
                  {t.notes.map((n) => (
                    <li key={n} className="text-zinc-300 font-light leading-relaxed">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
