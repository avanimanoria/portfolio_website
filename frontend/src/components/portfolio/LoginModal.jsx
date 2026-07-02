import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { X, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function formatError(detail) {
  if (!detail) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  if (detail?.msg) return detail.msg;
  return String(detail);
}

export default function LoginModal({ open, onClose, redirectTo }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => emailRef.current?.focus(), 150);
    } else {
      setEmail("");
      setPassword("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Both fields are required.");
    setBusy(true);
    try {
      await login(email, password);
      toast.success("Welcome back, Avani.");
      onClose();
      navigate(redirectTo || "/atelier");
    } catch (err) {
      toast.error(formatError(err?.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          data-testid="login-modal"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.form
            onSubmit={submit}
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative w-full max-w-md rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[#08111F]/95 p-8 md:p-10 shadow-[0_20px_80px_rgba(15,82,186,0.25)]"
          >
            <button
              type="button"
              onClick={onClose}
              data-testid="login-modal-close"
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,175,55,0.5)] text-[#F2DDB6]">
                <Lock size={16} strokeWidth={1.5} />
              </span>
              <div>
                <div className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-[#F2DDB6]">
                  Atelier
                </div>
                <div className="font-serif-display text-2xl text-white">Private access</div>
              </div>
            </div>

            <p className="text-sm text-zinc-400 font-light mb-8">
              This area is reserved. If you&apos;re not Avani, this modal will politely refuse you.
            </p>

            <div className="space-y-6">
              <div>
                <label htmlFor="login-email" className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                  Email
                </label>
                <input
                  ref={emailRef}
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="login-input-email"
                  placeholder="you@domain.com"
                  className="w-full bg-transparent border-0 border-b border-[rgba(255,255,255,0.15)] focus:border-[#D4AF37] outline-none py-3 text-white placeholder:text-zinc-600 font-light"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="login-input-password"
                  placeholder="••••••••"
                  className="w-full bg-transparent border-0 border-b border-[rgba(255,255,255,0.15)] focus:border-[#D4AF37] outline-none py-3 text-white placeholder:text-zinc-600 font-light"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              data-testid="login-submit-button"
              className="mt-10 w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-[#D4AF37] text-black hover:bg-[#F2DDB6] transition-colors disabled:opacity-60 font-mono-accent text-[11px] uppercase tracking-[0.28em]"
            >
              {busy ? "Verifying…" : "Enter atelier"}
            </button>

            <div className="mt-6 text-center font-mono-accent text-[9px] uppercase tracking-[0.28em] text-zinc-600">
              Shortcut · Ctrl / ⌘ + Shift + A · Esc to close
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
