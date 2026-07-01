import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, Mail } from "lucide-react";
import SectionHeader from "./SectionHeader";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || null,
        message: form.message.trim(),
      });
      toast.success("Your message has been received. I'll be in touch soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(
        typeof detail === "string" ? detail : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-transparent border-0 border-b border-[rgba(255,255,255,0.15)] focus:border-[#D4AF37] outline-none py-4 text-white placeholder:text-zinc-500 font-light text-base transition-colors";

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative py-24 md:py-40 max-container"
    >
      <SectionHeader
        index="05"
        eyebrow="Correspondence"
        title={
          <>
            Let&apos;s build something <span className="italic text-gold-gradient">considered</span>.
          </>
        }
        subtitle="A short note is enough. I read every message myself and reply within a few days."
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:col-span-5 space-y-8"
        >
          <div className="glass rounded-2xl p-8 md:p-10">
            <div className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-[#F2DDB6]">
              Direct
            </div>
            <a
              href="mailto:hello@avanimanoria.com"
              data-testid="contact-email-link"
              className="mt-4 inline-flex items-center gap-3 font-serif-display text-2xl md:text-3xl text-white hover:text-[#F2DDB6] transition-colors"
            >
              <Mail size={20} strokeWidth={1.25} className="text-[#D4AF37]" />
              hello@avanimanoria.com
            </a>
            <div className="gold-hair my-8" />
            <div className="space-y-5">
              {[
                { k: "Timezone", v: "IST · Available globally" },
                { k: "Response", v: "Within 2–3 business days" },
                { k: "Preferred", v: "Async, thoughtful, specific" },
              ].map((m) => (
                <div key={m.k} className="flex items-baseline justify-between gap-6">
                  <span className="font-mono-accent text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                    {m.k}
                  </span>
                  <span className="text-zinc-200 text-sm">{m.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { label: "LinkedIn", href: "#", handle: "in/avanimanoria" },
              { label: "GitHub", href: "#", handle: "github.com/avanimanoria" },
              { label: "Writing", href: "#", handle: "avanimanoria.com/notes" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                data-testid={`social-link-${s.label.toLowerCase()}`}
                className="group flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] py-4 hover:border-[rgba(212,175,55,0.35)] transition-colors"
              >
                <span className="font-mono-accent text-[11px] uppercase tracking-[0.28em] text-zinc-400 group-hover:text-[#F2DDB6] transition-colors">
                  {s.label}
                </span>
                <span className="flex items-center gap-3 text-white text-sm">
                  {s.handle}
                  <ArrowRight size={14} strokeWidth={1.5} className="text-[#D4AF37] transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          data-testid="contact-form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="md:col-span-7 glass rounded-2xl p-8 md:p-12 space-y-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="name" className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                Your name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={update("name")}
                placeholder="Ada Lovelace"
                data-testid="contact-input-name"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="email" className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                placeholder="you@studio.co"
                data-testid="contact-input-email"
                className={inputCls}
              />
            </div>
          </div>

          <div className="pt-4">
            <label htmlFor="subject" className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
              Subject <span className="text-zinc-600 normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="subject"
              type="text"
              value={form.subject}
              onChange={update("subject")}
              placeholder="A brief line about what you're building"
              data-testid="contact-input-subject"
              className={inputCls}
            />
          </div>

          <div className="pt-4">
            <label htmlFor="message" className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={update("message")}
              placeholder="Tell me about the problem, the constraints, and the timeline. The more specific, the better."
              data-testid="contact-input-message"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <p className="text-xs text-zinc-500 font-light max-w-sm">
              Your message is delivered directly. I reply from a personal inbox.
            </p>
            <button
              type="submit"
              disabled={loading}
              data-testid="contact-submit-button"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#D4AF37] text-black hover:bg-[#F2DDB6] transition-colors disabled:opacity-60"
            >
              <span className="font-mono-accent text-[11px] uppercase tracking-[0.28em]">
                {loading ? "Sending…" : "Send message"}
              </span>
              <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
