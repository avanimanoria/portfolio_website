import { motion } from "framer-motion";
import { Code2, Network, Sparkles, Workflow } from "lucide-react";
import SectionHeader from "./SectionHeader";

const disciplines = [
  {
    icon: Code2,
    title: "Software Engineering",
    caption: "Production-grade code",
    items: ["TypeScript · Python · Go", "React · Next.js · FastAPI", "PostgreSQL · Redis · Kafka", "Testing · CI/CD · DX"],
  },
  {
    icon: Network,
    title: "System Design",
    caption: "Architecture at scale",
    items: ["Distributed systems", "Event-driven design", "Multi-region topology", "Observability & SLOs"],
  },
  {
    icon: Sparkles,
    title: "Applied AI",
    caption: "LLMs in the real world",
    items: ["Agentic workflows", "RAG & vector search", "Fine-tuning · Evals", "Prompt engineering"],
  },
  {
    icon: Workflow,
    title: "Automation",
    caption: "Silent, reliable pipelines",
    items: ["Workflow orchestration", "ETL & data plumbing", "Serverless & schedulers", "Internal tooling"],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      data-testid="skills-section"
      className="relative py-24 md:py-40 max-container"
    >
      <SectionHeader
        index="02"
        eyebrow="Craft"
        title={
          <>
            Four disciplines. <span className="italic text-gold-gradient">One sensibility.</span>
          </>
        }
        subtitle="A cross-section of what I practice, refined over years of building for teams and shipping into the wild."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {disciplines.map((d, i) => {
          const Icon = d.icon;
          return (
            <motion.div
              key={d.title}
              data-testid={`skill-card-${d.title.toLowerCase().replace(/\s/g, "-")}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-8 md:p-10 hover:border-[rgba(212,175,55,0.4)] transition-colors"
            >
              <div
                aria-hidden
                className="absolute -top-24 -right-24 h-56 w-56 rounded-full opacity-0 blur-3xl group-hover:opacity-30 transition-opacity"
                style={{ background: "radial-gradient(closest-side, #D4AF37, transparent)" }}
              />
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                    {d.caption}
                  </span>
                  <h3 className="mt-3 font-serif-display text-3xl md:text-4xl text-white">
                    {d.title}
                  </h3>
                </div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(212,175,55,0.4)] text-[#F2DDB6]">
                  <Icon size={18} strokeWidth={1.25} />
                </span>
              </div>
              <div className="gold-hair mt-8 mb-6" />
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                {d.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm text-zinc-300 font-light">
                    <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
