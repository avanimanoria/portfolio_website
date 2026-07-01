import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-[rgba(255,255,255,0.06)] bg-[#050505]"
    >
      <div className="max-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-6">
            <Logo />
            <p className="mt-6 max-w-md text-zinc-400 font-light leading-relaxed">
              An independent engineer working at the intersection of software, systems, and
              applied intelligence. Available for select, deeply-considered engagements.
            </p>
          </div>
          <div className="md:col-span-3">
            <div className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-4">
              Navigate
            </div>
            <ul className="space-y-2 text-zinc-300 font-light">
              <li><a href="#about" className="hover:text-[#F2DDB6] transition-colors">About</a></li>
              <li><a href="#skills" className="hover:text-[#F2DDB6] transition-colors">Craft</a></li>
              <li><a href="#projects" className="hover:text-[#F2DDB6] transition-colors">Work</a></li>
              <li><a href="#experience" className="hover:text-[#F2DDB6] transition-colors">Journey</a></li>
              <li><a href="#contact" className="hover:text-[#F2DDB6] transition-colors">Contact</a></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-4">
              Elsewhere
            </div>
            <ul className="space-y-2 text-zinc-300 font-light">
              <li><a href="#" className="hover:text-[#F2DDB6] transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-[#F2DDB6] transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-[#F2DDB6] transition-colors">Notes</a></li>
              <li><a href="mailto:hello@avanimanoria.com" className="hover:text-[#F2DDB6] transition-colors">Email</a></li>
            </ul>
          </div>
        </div>
        <div className="gold-hair my-14" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
            © {year} · Avani Manoria · Designed & engineered with restraint.
          </div>
          <div className="flex items-center gap-3 font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            All systems nominal
          </div>
        </div>
      </div>
    </footer>
  );
}
