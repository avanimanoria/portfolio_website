import { motion } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function Projects({ projects = [] }) {
  const list = projects.length > 0 ? projects : [];

  return (
    <section id="projects" data-testid="projects-section" className="relative py-24 md:py-40 max-container">
      <SectionHeader
        index="03"
        eyebrow="Selected Work"
        title={
          <>
            A quiet record of{" "}
            <span className="font-serif-italic text-gold-gradient">things built</span>.
          </>
        }
        subtitle="Three projects spanning full-stack engineering, applied machine learning, and an original AI concept."
      />

      <div className="space-y-16 md:space-y-24">
        {list.map((p, i) => (
          <motion.article
            key={p.id || i}
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
                  src={p.image_url || "https://images.pexels.com/photos/8346914/pexels-photo-8346914.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"}
                  alt={p.title}
                  className="h-full w-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1200ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]"
                />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 opacity-70"
                style={{ background: "linear-gradient(180deg, transparent 40%, rgba(5,5,5,0.7) 100%)" }}
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
              <h3 className="font-serif-display text-3xl md:text-4xl text-white leading-tight">{p.title}</h3>
              <p className="mt-5 text-zinc-400 font-light leading-relaxed">{p.blurb}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {(p.stack || []).map((s) => (
                  <span
                    key={s}
                    className="font-mono-accent text-[10px] uppercase tracking-[0.24em] text-zinc-400 border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {p.github_url ? (
                  <a
                    href={p.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`project-github-${i}`}
                    className="group inline-flex items-center gap-3 text-white hover:text-[#F2DDB6] transition-colors"
                  >
                    <Github size={14} strokeWidth={1.5} />
                    <span className="font-mono-accent text-[11px] uppercase tracking-[0.28em]">Source</span>
                    <ArrowUpRight size={14} strokeWidth={1.5} className="text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : null}
                {p.live_url ? (
                  <a
                    href={p.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`project-live-${i}`}
                    className="group inline-flex items-center gap-3 text-white hover:text-[#7BAAF7] transition-colors"
                  >
                    <ExternalLink size={14} strokeWidth={1.5} />
                    <span className="font-mono-accent text-[11px] uppercase tracking-[0.28em]">Live</span>
                  </a>
                ) : null}
                {!p.github_url && !p.live_url ? (
                  <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                    Case study on request
                  </span>
                ) : null}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
