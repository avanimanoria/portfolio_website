const items = [
  "Distributed Systems",
  "LLM Orchestration",
  "Event-driven Architecture",
  "Automation Pipelines",
  "Cloud Native",
  "Vector Retrieval",
  "Observability",
  "Agentic Workflows",
  "Edge & Serverless",
  "System Design at Scale",
];

export default function Marquee() {
  const list = [...items, ...items];
  return (
    <section
      aria-hidden
      data-testid="marquee-section"
      className="relative border-y border-[rgba(255,255,255,0.05)] bg-[#0A0A0A]/40 py-6 overflow-hidden"
    >
      <div className="flex gap-16 whitespace-nowrap marquee-track will-change-transform">
        {list.map((t, i) => (
          <div key={i} className="flex items-center gap-16 shrink-0">
            <span className="font-serif-display italic text-2xl md:text-3xl text-zinc-500">
              {t}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
          </div>
        ))}
      </div>
    </section>
  );
}
