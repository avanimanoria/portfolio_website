import { motion } from "framer-motion";

function initials(name = "Avani Manoria") {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Logo({ compact = false, settings = null, testId = "nav-logo" }) {
  const name = settings?.name || "Avani Manoria";
  const [first, ...rest] = name.split(" ");
  const last = rest.join(" ");
  const mono = initials(name);

  return (
    <a
      href="#top"
      data-testid={testId}
      className="group inline-flex items-center gap-3 select-none"
      aria-label={`${name} — Home`}
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,175,55,0.45)]"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full opacity-70 blur-md"
          style={{ background: "radial-gradient(closest-side, rgba(212,175,55,0.25), rgba(15,82,186,0.15), transparent)" }}
        />
        <span className="font-serif-display text-[15px] leading-none tracking-tight text-gold-gradient relative">
          {mono[0]}<span className="inline-block -ml-[3px]">{mono[1]}</span>
        </span>
      </motion.span>
      {!compact && (
        <span className="hidden sm:flex flex-col leading-tight">
          <span className="font-serif-display text-lg text-white group-hover:text-[#F2DDB6] transition-colors">
            {first} <span className="font-serif-italic text-[#F2DDB6]">{last}</span>
          </span>
          <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
            Software · ML · AI
          </span>
        </span>
      )}
    </a>
  );
}
