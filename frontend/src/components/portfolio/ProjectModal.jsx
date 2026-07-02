import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, PlayCircle } from "lucide-react";

const BACKEND = process.env.REACT_APP_BACKEND_URL || "";

function isYouTube(url) {
  return /(?:youtube\.com|youtu\.be)/i.test(url || "");
}
function isVimeo(url) {
  return /vimeo\.com/i.test(url || "");
}
function toYouTubeEmbed(url) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  const id = m ? m[1] : "";
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
}
function toVimeoEmbed(url) {
  const m = url.match(/vimeo\.com\/(\d+)/);
  const id = m ? m[1] : "";
  return `https://player.vimeo.com/video/${id}`;
}
function normalizeVideoSrc(url) {
  if (!url) return "";
  // Uploaded via /api/uploads → prepend backend origin so <video> can fetch through ingress
  if (url.startsWith("/api/uploads/")) return `${BACKEND}${url}`;
  return url;
}

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10"
          data-testid="project-modal"
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative w-full max-w-5xl max-h-[92vh] overflow-auto rounded-2xl border border-[rgba(212,175,55,0.3)] bg-[#08111F]/95 shadow-[0_30px_100px_rgba(15,82,186,0.25)]"
          >
            <button
              type="button"
              onClick={onClose}
              data-testid="project-modal-close"
              className="absolute top-4 right-4 z-20 inline-flex items-center justify-center h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 text-zinc-300 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <VideoBlock url={project.demo_video_url} poster={project.image_url} />

            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="font-mono-accent text-[10px] uppercase tracking-[0.24em] text-[#F2DDB6] border border-[rgba(212,175,55,0.35)] px-3 py-1.5 rounded-full">
                  {project.kind}
                </span>
                <span className="font-mono-accent text-[10px] uppercase tracking-[0.24em] text-zinc-300 border border-[rgba(255,255,255,0.15)] px-3 py-1.5 rounded-full">
                  {project.year}
                </span>
              </div>

              <h2 className="font-serif-display text-3xl md:text-5xl text-white leading-tight">
                {project.title}
              </h2>

              <p className="mt-6 text-zinc-300 font-light leading-relaxed text-base md:text-lg max-w-3xl">
                {project.blurb}
              </p>

              {(project.stack || []).length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {(project.stack || []).map((s) => (
                    <span
                      key={s}
                      className="font-mono-accent text-[10px] uppercase tracking-[0.24em] text-zinc-400 border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="gold-hair my-10" />

              <div className="flex flex-wrap items-center gap-4">
                {project.github_url ? (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="project-modal-github"
                    className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[rgba(255,255,255,0.18)] hover:border-[#D4AF37] text-white hover:text-[#F2DDB6] transition-colors"
                  >
                    <Github size={16} strokeWidth={1.5} />
                    <span className="font-mono-accent text-[11px] uppercase tracking-[0.28em]">
                      View on GitHub
                    </span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                ) : null}
                {project.live_url ? (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="project-modal-live"
                    className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#D4AF37] text-black hover:bg-[#F2DDB6] transition-colors"
                  >
                    <ExternalLink size={16} strokeWidth={1.5} />
                    <span className="font-mono-accent text-[11px] uppercase tracking-[0.28em]">
                      Visit live
                    </span>
                  </a>
                ) : null}
                {!project.github_url && !project.live_url ? (
                  <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                    Links coming soon
                  </span>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function VideoBlock({ url, poster }) {
  if (!url) {
    return (
      <div className="relative aspect-[16/9] w-full bg-[#0B1E3F] flex items-center justify-center">
        {poster ? (
          <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        ) : null}
        <div className="relative z-10 flex flex-col items-center gap-2 text-zinc-400">
          <PlayCircle size={40} strokeWidth={1} className="text-[#D4AF37]" />
          <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em]">
            Demo video coming soon
          </span>
        </div>
      </div>
    );
  }
  if (isYouTube(url)) {
    return (
      <div className="relative aspect-[16/9] w-full bg-black">
        <iframe
          src={toYouTubeEmbed(url)}
          className="absolute inset-0 h-full w-full"
          title="Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  if (isVimeo(url)) {
    return (
      <div className="relative aspect-[16/9] w-full bg-black">
        <iframe
          src={toVimeoEmbed(url)}
          className="absolute inset-0 h-full w-full"
          title="Demo"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className="relative aspect-[16/9] w-full bg-black">
      <video
        src={normalizeVideoSrc(url)}
        poster={poster || undefined}
        controls
        playsInline
        preload="metadata"
        data-testid="project-modal-video"
        className="absolute inset-0 h-full w-full object-contain bg-black"
      />
    </div>
  );
}
