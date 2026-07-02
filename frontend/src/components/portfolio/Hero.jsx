import { motion } from "framer-motion";
import Scene3D from "./Scene3D";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };
const line = {
  hidden: { y: 40, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.9, ease: [0.2, 0.7, 0.2, 1] } },
};

export default function Hero({ settings }) {
  const name = settings?.name || "Avani Manoria";
  const tagline = settings?.tagline || "engineering the quiet elegance behind intelligent systems.";
  const meta = settings?.hero_meta || {
    based_in: "India · Remote",
    focus: "Full-stack · ML · AI",
    experience: "Final Year · Engineering",
    status: "Open to opportunities",
  };

  const [first, ...restParts] = name.split(" ");
  const last = restParts.join(" ") || "";

  return (
    <section id="top" data-testid="hero-section" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Scene3D />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(5,5,5,0) 0%, rgba(5,5,5,0.9) 90%), radial-gradient(ellipse at 50% 0%, rgba(5,5,5,0) 40%, rgba(5,5,5,0.7) 100%)",
        }}
      />

      <div className="relative z-10 max-container flex flex-col justify-center min-h-[100svh] pt-32 pb-24">
        <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-4xl">
          <motion.div variants={line} className="flex items-center gap-3 mb-8">
            <span className="h-px w-10 bg-[#D4AF37]" />
            <span className="font-mono-accent text-[11px] uppercase tracking-[0.32em] text-[#F2DDB6]">
              Portfolio · MMXXVI
            </span>
          </motion.div>

          <motion.h1
            variants={line}
            data-testid="hero-title"
            className="font-serif-display text-white text-[13vw] sm:text-[10vw] md:text-[8vw] lg:text-[7.2vw] leading-[0.95] tracking-tight"
          >
            {first} <span className="font-serif-italic text-gold-gradient">{last}</span>
          </motion.h1>

          <motion.p variants={line} className="font-serif-italic text-2xl sm:text-3xl text-zinc-300 mt-6">
            {tagline}
          </motion.p>

          <motion.p variants={line} className="mt-8 max-w-xl text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
            A final-year engineering student building at the intersection of{" "}
            <span className="text-white">full-stack software</span>,{" "}
            <span className="text-white">machine learning</span>, and{" "}
            <span className="text-white">applied AI</span>. Curious, careful, and quietly ambitious.
          </motion.p>

          <motion.div variants={line} className="mt-12 flex flex-wrap items-center gap-5">
            <a
              href="#projects"
              data-testid="hero-view-work-button"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#D4AF37] text-black overflow-hidden"
            >
              <span className="relative z-10 font-mono-accent text-[11px] uppercase tracking-[0.28em]">
                View selected work
              </span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 gold-shimmer opacity-70" />
            </a>
            <a
              href="#contact"
              data-testid="hero-contact-button"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[rgba(59,125,221,0.35)] text-white hover:border-[#3B7DDD] hover:text-[#7BAAF7] transition-colors"
            >
              <span className="font-mono-accent text-[11px] uppercase tracking-[0.28em]">
                Begin a conversation
              </span>
            </a>
          </motion.div>

          <motion.div variants={line} className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
            {[
              { k: "Based in", v: meta.based_in },
              { k: "Focus", v: meta.focus },
              { k: "Stage", v: meta.experience },
              { k: "Status", v: meta.status },
            ].map((m) => (
              <div key={m.k}>
                <div className="font-mono-accent text-[10px] uppercase tracking-[0.24em] text-zinc-500">{m.k}</div>
                <div className="mt-1 text-sm text-zinc-200 font-light">{m.v}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500"
        >
          <span className="font-mono-accent text-[10px] uppercase tracking-[0.4em]">Scroll</span>
          <span className="h-8 w-px bg-gradient-to-b from-[rgba(212,175,55,0.6)] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
