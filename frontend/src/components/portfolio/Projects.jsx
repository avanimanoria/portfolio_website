import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "./SectionHeader";

const projects = [
  {
    year: "2025",
    kind: "AI · Platform",
    title: "Aurum — Agentic workflow platform",
    blurb:
      "A multi-agent orchestration layer with pluggable tool graphs, evaluation harnesses, and human-in-the-loop review. Sub-second routing across 40+ tools.",
    stack: ["Python", "FastAPI", "Postgres", "LangGraph", "Redis"],
    image:
      "https://images.pexels.com/photos/8346914/pexels-photo-8346914.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    year: "2024",
    kind: "Systems",
    title: "Meridian — Multi-region event mesh",
    blurb:
      "A globally-consistent event delivery mesh built on Kafka, with cross-region replication, idempotent consumers, and 99.99% delivery SLOs.",
    stack: ["Go", "Kafka", "gRPC", "Kubernetes", "Terraform"],
    image:
      "https://images.unsplash.com/photo-1709625862266-014ef072fd93?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGx1eHVyeSUyMGRhcmslMjBnZW9tZXRyeSUyMDNkfGVufDB8fHx8MTc4MjkzNDM0N3ww&ixlib=rb-4.1.0&q=85",
  },
  {
    year: "2024",
    kind: "Automation",
    title: "Loom — internal automation studio",
    blurb:
      "A no-code workflow studio powering ops teams — turning tribal knowledge into audited, versioned pipelines with 12,000+ runs a day.",
    stack: ["TypeScript", "Next.js", "Temporal", "Postgres"],
    image:
      "https://images.unsplash.com/photo-1517241034903-9a4c3ab12f00?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGx1eHVyeSUyMGRhcmslMjBnZW9tZXRyeSUyMDNkfGVufDB8fHx8MTc4MjkzNDM0N3ww&ixlib=rb-4.1.0&q=85",
  },
  {
    year: "2023",
    kind: "AI · Retrieval",
    title: "Cortex — knowledge retrieval engine",
    blurb:
      "A hybrid retrieval engine with re-ranking, semantic caching, and eval-driven prompt design. Powering search across 4M+ enterprise documents.",
    stack: ["Python", "pgvector", "Rust", "OpenAI", "FastAPI"],
    image:
      "https://images.unsplash.com/photo-1735948055457-8d816fb80a87?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwyfHxtaW5pbWFsaXN0JTIwZWxlZ2FudCUyMHdvcmtzcGFjZSUyMGRhcmt8ZW58MHx8fHwxNzgyMTA1OTYzfDA&ixlib=rb-4.1.0&q=85",
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      data-testid="projects-section"
      className="relative py-24 md:py-40 max-container"
    >
      <SectionHeader
        index="03"
        eyebrow="Selected Work"
        title={
          <>
            A quiet record of <span className="italic text-gold-gradient">things built</span>.
          </>
        }
        subtitle="A curated slice — enterprise platforms, internal engines, and the occasional side quest that turned into something more."
      />

      <div className="space-y-16 md:space-y-24">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            data-testid="project-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
            className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center ${
              i % 2 ? "md:[&>div:first-child]:order-2" : ""
            }`}
          >
            <div className="md:col-span-7 relative group overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)]">
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1200ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]"
                />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 opacity-70"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 40%, rgba(5,5,5,0.7) 100%)",
                }}
              />
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="font-mono-accent text-[10px] uppercase tracking-[0.24em] text-[#F2DDB6] bg-[rgba(5,5,5,0.55)] px-3 py-1.5 rounded-full border border-[rgba(212,175,55,0.35)]">
                  {p.kind}
                </span>
                <span className="font-mono-accent text-[10px] uppercase tracking-[0.24em] text-zinc-300 bg-[rgba(5,5,5,0.55)] px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.15)]">
                  {p.year}
                </span>
              </div>
            </div>
            <div className="md:col-span-5">
              <h3 className="font-serif-display text-3xl md:text-4xl text-white leading-tight">
                {p.title}
              </h3>
              <p className="mt-5 text-zinc-400 font-light leading-relaxed">{p.blurb}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="font-mono-accent text-[10px] uppercase tracking-[0.24em] text-zinc-400 border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <button
                type="button"
                data-testid={`project-cta-${i}`}
                className="mt-8 group inline-flex items-center gap-3 text-white hover:text-[#F2DDB6] transition-colors"
              >
                <span className="font-mono-accent text-[11px] uppercase tracking-[0.28em]">
                  View case study
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(212,175,55,0.4)] group-hover:bg-[rgba(212,175,55,0.1)] transition-colors">
                  <ArrowUpRight size={14} strokeWidth={1.5} />
                </span>
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
