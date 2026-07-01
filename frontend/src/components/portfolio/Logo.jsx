import { motion } from "framer-motion";

/**
 * Custom typographic monogram for Avani Manoria.
 * "AM" mark with an elegant hairline frame + full wordmark.
 */
export default function Logo({ compact = false, testId = "nav-logo" }) {
  return (
    <a
      href="#top"
      data-testid={testId}
      className="group inline-flex items-center gap-3 select-none"
      aria-label="Avani Manoria — Home"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,175,55,0.4)]"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full opacity-60 blur-md"
          style={{ background: "radial-gradient(closest-side, rgba(212,175,55,0.25), transparent)" }}
        />
        <span className="font-serif-display text-[15px] leading-none tracking-tight text-gold-gradient relative">
          A<span className="inline-block -ml-[3px]">M</span>
        </span>
      </motion.span>
      {!compact && (
        <span className="hidden sm:flex flex-col leading-tight">
          <span className="font-serif-display text-lg text-white group-hover:text-[#F2DDB6] transition-colors">
            Avani <span className="italic text-[#F2DDB6]">Manoria</span>
          </span>
          <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
            Software · Systems · AI
          </span>
        </span>
      )}
    </a>
  );
}
