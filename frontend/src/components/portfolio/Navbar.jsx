import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";

const links = [
  { label: "About", href: "#about" },
  { label: "Craft", href: "#skills" },
  { label: "Work", href: "#projects" },
  { label: "Journey", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const availability = settings?.availability || "Open to work";

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled
          ? "bg-[rgba(5,5,5,0.75)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]"
          : "bg-transparent"
      }`}
      data-testid="site-navbar"
    >
      <div className="max-container flex items-center justify-between h-20">
        <Logo settings={settings} />
        <nav data-testid="nav-links" className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="group relative font-mono-accent text-[11px] uppercase tracking-[0.28em] text-zinc-400 hover:text-[#F2DDB6] transition-colors"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[#D4AF37] group-hover:w-full transition-all duration-500" />
            </a>
          ))}
        </nav>
        <div className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[rgba(212,175,55,0.4)] text-[#F2DDB6] text-xs font-mono-accent uppercase tracking-[0.24em]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          {availability}
        </div>
        <button
          type="button"
          data-testid="mobile-nav-toggle"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`h-px w-6 bg-white transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-white transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`h-px w-6 bg-white transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[rgba(5,5,5,0.95)] backdrop-blur-xl border-t border-[rgba(255,255,255,0.05)]">
          <div className="max-container py-6 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-mono-accent text-xs uppercase tracking-[0.28em] text-zinc-400 hover:text-[#F2DDB6]"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.header>
  );
}
