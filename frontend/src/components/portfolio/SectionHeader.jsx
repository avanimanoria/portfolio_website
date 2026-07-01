import { motion } from "framer-motion";

export default function SectionHeader({ eyebrow, title, subtitle, index }) {
  return (
    <div className="mb-16 md:mb-24 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-4"
      >
        {index && (
          <span className="font-mono-accent text-[11px] tracking-[0.28em] text-[#D4AF37]">
            {index}
          </span>
        )}
        <span className="h-px w-10 bg-[#D4AF37]" />
        <span className="font-mono-accent text-[11px] uppercase tracking-[0.32em] text-[#F2DDB6]">
          {eyebrow}
        </span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay: 0.05 }}
        className="mt-6 font-serif-display text-white text-5xl md:text-7xl leading-[1] tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="mt-6 text-zinc-400 text-lg font-light max-w-2xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
