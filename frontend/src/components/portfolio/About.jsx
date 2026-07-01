import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

export default function About() {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="relative py-24 md:py-40 max-container"
    >
      <SectionHeader
        index="01"
        eyebrow="A Brief Introduction"
        title={
          <>
            A quiet obsession with the <span className="italic text-gold-gradient">architecture of things</span>.
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-7 space-y-8">
          <p className="text-zinc-300 text-lg md:text-xl font-light leading-relaxed">
            I&apos;m a software engineer working at the intersection of{" "}
            <span className="text-white">distributed systems</span>,{" "}
            <span className="text-white">applied AI</span>, and{" "}
            <span className="text-white">automation</span>. I care about the parts of engineering
            that are invisible when they work: latency budgets, back-pressure, retries, graceful
            degradation, the small ceremonies that make software feel calm.
          </p>
          <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed">
            My favourite problems are the ones where a system is on the edge of collapse — where the
            answer is not more code, but a more considered design. I like turning tangled workflows
            into elegant pipelines, and half-formed ideas into products people trust.
          </p>

          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[
              { k: "Systems shipped", v: "40+" },
              { k: "Cloud regions", v: "12" },
              { k: "Automations", v: "∞" },
            ].map((s) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="border-l border-[rgba(212,175,55,0.4)] pl-4"
              >
                <div className="font-serif-display text-4xl text-white">{s.v}</div>
                <div className="mt-1 font-mono-accent text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  {s.k}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="md:col-span-5"
        >
          <div className="glass rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-16 -right-16 h-52 w-52 rounded-full opacity-30 blur-2xl"
              style={{ background: "radial-gradient(closest-side, #D4AF37, transparent)" }}
            />
            <div className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-[#F2DDB6]">
              Philosophy
            </div>
            <p className="mt-4 font-serif-display italic text-2xl md:text-3xl text-white leading-snug">
              &ldquo;Great systems are not built loud. They&apos;re built listening.&rdquo;
            </p>
            <div className="mt-8 space-y-4">
              {[
                ["Craft", "Every abstraction earns its place."],
                ["Restraint", "Fewer moving parts, longer lifespans."],
                ["Curiosity", "The best architectures come from questions."],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start gap-4">
                  <span className="mt-2 h-1 w-6 bg-[#D4AF37] shrink-0" />
                  <div>
                    <div className="text-white text-sm">{k}</div>
                    <div className="text-zinc-400 text-sm font-light">{v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
