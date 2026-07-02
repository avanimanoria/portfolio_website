import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

export default function Education({ items = [] }) {
  const list = items.length > 0 ? items : [];

  return (
    <section id="experience" data-testid="experience-section" className="relative py-24 md:py-40 max-container">
      <SectionHeader
        index="04"
        eyebrow="Percorso"
        title={
          <>
            Studying, building, <span className="font-serif-italic text-gold-gradient">becoming</span>.
          </>
        }
        subtitle="I'm in the middle of my undergraduate journey — collecting concepts, sharpening instincts, and shipping things that live on the internet."
      />

      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[rgba(212,175,55,0.35)] to-transparent" />
        <div className="space-y-14 md:space-y-24">
          {list.map((t, i) => (
            <motion.div
              key={t.id || t.period || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-start"
            >
              <span className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-2 h-3 w-3 rounded-full bg-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.6)]" />

              <div className={`pl-10 md:pl-0 ${i % 2 ? "md:order-2 md:pl-16" : "md:text-right md:pr-16"}`}>
                <div className="font-mono-accent text-[11px] uppercase tracking-[0.28em] text-[#F2DDB6]">
                  {t.period}
                </div>
                <h3 className="mt-3 font-serif-display text-2xl md:text-3xl text-white">{t.degree}</h3>
                <div className="mt-1 text-zinc-400 italic">{t.institution}</div>
              </div>
              <div className={`pl-10 md:pl-0 ${i % 2 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                <ul className="space-y-3">
                  {(t.notes || []).map((n, idx) => (
                    <li key={idx} className="text-zinc-300 font-light leading-relaxed">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Signature flourish */}
      <div className="mt-24 md:mt-32 text-center">
        <div className="font-signature text-5xl md:text-6xl text-gold-gradient">Avani</div>
        <div className="mt-2 font-mono-accent text-[10px] uppercase tracking-[0.4em] text-zinc-500">
          Con cura · with care
        </div>
      </div>
    </section>
  );
}
