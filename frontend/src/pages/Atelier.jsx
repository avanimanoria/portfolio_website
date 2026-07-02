import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LogOut, Save, Plus, Trash2, Mail, GraduationCap, Briefcase, User, Settings as SettingsIcon, Inbox } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import Logo from "@/components/portfolio/Logo";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "messages", label: "Messages", icon: Inbox },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

function Field({ label, value, onChange, type = "text", rows = 0, placeholder = "", testId }) {
  const cls =
    "w-full bg-transparent border-0 border-b border-[rgba(255,255,255,0.15)] focus:border-[#D4AF37] outline-none py-3 text-white placeholder:text-zinc-600 font-light text-sm transition-colors";
  return (
    <div>
      <label className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">{label}</label>
      {rows > 0 ? (
        <textarea
          rows={rows}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          data-testid={testId}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          data-testid={testId}
          className={cls}
        />
      )}
    </div>
  );
}

function StackInput({ value = [], onChange }) {
  const [txt, setTxt] = useState(value.join(", "));
  useEffect(() => setTxt(value.join(", ")), [value]);
  return (
    <Field
      label="Stack (comma-separated)"
      value={txt}
      onChange={(v) => {
        setTxt(v);
        onChange(v.split(",").map((s) => s.trim()).filter(Boolean));
      }}
      placeholder="React, Node, MongoDB"
    />
  );
}

function NotesInput({ value = [], onChange }) {
  const [txt, setTxt] = useState((value || []).join("\n"));
  useEffect(() => setTxt((value || []).join("\n")), [value]);
  return (
    <Field
      label="Notes (one per line)"
      value={txt}
      rows={3}
      onChange={(v) => {
        setTxt(v);
        onChange(v.split("\n").map((s) => s.trim()).filter(Boolean));
      }}
    />
  );
}

export default function Atelier({ openLogin }) {
  const { admin, ready, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("profile");
  const loggingOut = useRef(false);

  useEffect(() => {
    if (ready && !admin && !loggingOut.current) {
      openLogin?.();
      navigate("/");
    }
  }, [ready, admin, openLogin, navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500 font-mono-accent text-xs uppercase tracking-[0.3em]">
        Verifying…
      </div>
    );
  }
  if (!admin) return null;

  const handleLogout = () => {
    loggingOut.current = true;
    navigate("/");
    setTimeout(() => {
      logout();
      toast.success("Logged out.");
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="atelier-page">
      <header className="sticky top-0 z-40 bg-[rgba(5,5,5,0.85)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-container flex items-center justify-between h-20">
          <div className="flex items-center gap-6">
            <Logo compact />
            <div>
              <div className="font-serif-italic text-lg text-[#F2DDB6]">Atelier</div>
              <div className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                Private editor · {admin.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden sm:inline-flex font-mono-accent text-[11px] uppercase tracking-[0.28em] text-zinc-400 hover:text-[#F2DDB6] transition-colors"
            >
              View site →
            </a>
            <button
              type="button"
              onClick={handleLogout}
              data-testid="atelier-logout-button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.15)] hover:border-[#D4AF37] text-zinc-300 hover:text-[#F2DDB6] transition-colors"
            >
              <LogOut size={14} strokeWidth={1.5} />
              <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em]">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-container py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        <nav className="md:col-span-3">
          <div className="glass rounded-2xl p-3 sticky top-28">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  data-testid={`atelier-tab-${t.id}`}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                    active ? "bg-[rgba(212,175,55,0.1)] text-[#F2DDB6]" : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  <span className="font-mono-accent text-[11px] uppercase tracking-[0.28em]">{t.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="md:col-span-9">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass rounded-2xl p-6 md:p-10"
          >
            {tab === "profile" && <ProfileTab />}
            {tab === "projects" && <ProjectsTab />}
            {tab === "education" && <EducationTab />}
            {tab === "messages" && <MessagesTab />}
            {tab === "settings" && <SettingsTab />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ---------- Tabs ----------

function ProfileTab() {
  const [s, setS] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.get("/profile/settings").then((r) => setS(r.data)); }, []);
  if (!s) return <div className="text-zinc-500 text-sm">Loading…</div>;

  const setField = (k) => (v) => setS({ ...s, [k]: v });
  const setNested = (k, sub) => (v) => setS({ ...s, [k]: { ...s[k], [sub]: v } });

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch("/profile/settings", {
        name: s.name,
        tagline: s.tagline,
        bio_paragraph_1: s.bio_paragraph_1,
        bio_paragraph_2: s.bio_paragraph_2,
        philosophy_quote: s.philosophy_quote,
        contact_email: s.contact_email,
        availability: s.availability,
        socials: s.socials,
        hero_meta: s.hero_meta,
      });
      setS(data);
      toast.success("Profile saved.");
    } catch (e) {
      toast.error("Could not save. Check the fields.");
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-8">
      <TabHeader title="Profile & Bio" caption="This copy is shown across the public site." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Name" value={s.name} onChange={setField("name")} testId="atelier-input-name" />
        <Field label="Contact email" value={s.contact_email} onChange={setField("contact_email")} type="email" testId="atelier-input-email" />
        <Field label="Tagline" value={s.tagline} onChange={setField("tagline")} testId="atelier-input-tagline" />
        <Field label="Availability" value={s.availability} onChange={setField("availability")} placeholder="Open to work" />
      </div>
      <Field label="Bio paragraph 1" value={s.bio_paragraph_1} onChange={setField("bio_paragraph_1")} rows={3} testId="atelier-input-bio1" />
      <Field label="Bio paragraph 2" value={s.bio_paragraph_2} onChange={setField("bio_paragraph_2")} rows={3} testId="atelier-input-bio2" />
      <Field label="Philosophy quote (about section)" value={s.philosophy_quote} onChange={setField("philosophy_quote")} rows={2} />

      <div>
        <div className="font-serif-display text-xl text-white mb-3">Hero meta strip</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Based in" value={s.hero_meta?.based_in} onChange={setNested("hero_meta", "based_in")} />
          <Field label="Focus" value={s.hero_meta?.focus} onChange={setNested("hero_meta", "focus")} />
          <Field label="Stage" value={s.hero_meta?.experience} onChange={setNested("hero_meta", "experience")} />
          <Field label="Status" value={s.hero_meta?.status} onChange={setNested("hero_meta", "status")} />
        </div>
      </div>

      <div>
        <div className="font-serif-display text-xl text-white mb-3">Social handles</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="LinkedIn URL" value={s.socials?.linkedin} onChange={setNested("socials", "linkedin")} testId="atelier-input-linkedin" />
          <Field label="GitHub URL" value={s.socials?.github} onChange={setNested("socials", "github")} testId="atelier-input-github" />
          <Field label="Twitter / X URL" value={s.socials?.twitter} onChange={setNested("socials", "twitter")} />
          <Field label="Writing / Blog URL" value={s.socials?.writing} onChange={setNested("socials", "writing")} />
        </div>
      </div>

      <SaveBar onSave={save} saving={saving} />
    </div>
  );
}

function ProjectsTab() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(null);

  const load = () => api.get("/projects").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const setField = (id, k, v) =>
    setItems((arr) => arr.map((p) => (p.id === id ? { ...p, [k]: v } : p)));

  const saveOne = async (p) => {
    setSaving(p.id);
    try {
      const { data } = await api.patch(`/projects/${p.id}`, {
        kind: p.kind, year: p.year, title: p.title, blurb: p.blurb,
        stack: p.stack || [], image_url: p.image_url || "",
        github_url: p.github_url || "", live_url: p.live_url || "",
        order: p.order || 0,
      });
      setItems((arr) => arr.map((x) => (x.id === data.id ? data : x)));
      toast.success("Saved.");
    } catch { toast.error("Could not save."); }
    finally { setSaving(null); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}`);
    setItems((arr) => arr.filter((p) => p.id !== id));
    toast.success("Deleted.");
  };

  const create = async () => {
    const { data } = await api.post("/projects", {
      kind: "Full-stack", year: `${new Date().getFullYear()}`,
      title: "New project", blurb: "Describe this project.",
      stack: [], order: items.length,
    });
    setItems((arr) => [...arr, data]);
    toast.success("Project added.");
  };

  return (
    <div className="space-y-6">
      <TabHeader
        title="Projects"
        caption="Edit inline. Each project is saved individually."
        right={
          <button
            type="button"
            onClick={create}
            data-testid="atelier-add-project"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(212,175,55,0.4)] text-[#F2DDB6] hover:bg-[rgba(212,175,55,0.08)] transition-colors"
          >
            <Plus size={14} />
            <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em]">Add project</span>
          </button>
        }
      />
      {items.length === 0 && <div className="text-zinc-500 text-sm">No projects yet.</div>}
      {items.map((p) => (
        <div key={p.id} className="rounded-xl border border-[rgba(255,255,255,0.06)] p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Kind" value={p.kind} onChange={(v) => setField(p.id, "kind", v)} />
            <Field label="Year" value={p.year} onChange={(v) => setField(p.id, "year", v)} />
            <Field label="Order" type="number" value={p.order} onChange={(v) => setField(p.id, "order", Number(v) || 0)} />
          </div>
          <Field label="Title" value={p.title} onChange={(v) => setField(p.id, "title", v)} />
          <Field label="Blurb" value={p.blurb} onChange={(v) => setField(p.id, "blurb", v)} rows={3} />
          <StackInput value={p.stack || []} onChange={(v) => setField(p.id, "stack", v)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Image URL" value={p.image_url} onChange={(v) => setField(p.id, "image_url", v)} />
            <Field label="GitHub URL" value={p.github_url} onChange={(v) => setField(p.id, "github_url", v)} />
          </div>
          <Field label="Live URL" value={p.live_url} onChange={(v) => setField(p.id, "live_url", v)} />
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => remove(p.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,80,80,0.3)] text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
              <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em]">Delete</span>
            </button>
            <button
              type="button"
              onClick={() => saveOne(p)}
              disabled={saving === p.id}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#D4AF37] text-black hover:bg-[#F2DDB6] transition-colors disabled:opacity-60"
            >
              <Save size={14} />
              <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em]">
                {saving === p.id ? "Saving…" : "Save"}
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function EducationTab() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(null);
  const load = () => api.get("/education").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const setField = (id, k, v) => setItems((arr) => arr.map((e) => (e.id === id ? { ...e, [k]: v } : e)));

  const saveOne = async (e) => {
    setSaving(e.id);
    try {
      const { data } = await api.patch(`/education/${e.id}`, {
        period: e.period, degree: e.degree, institution: e.institution,
        notes: e.notes || [], order: e.order || 0,
      });
      setItems((arr) => arr.map((x) => (x.id === data.id ? data : x)));
      toast.success("Saved.");
    } catch { toast.error("Could not save."); }
    finally { setSaving(null); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    await api.delete(`/education/${id}`);
    setItems((arr) => arr.filter((e) => e.id !== id));
    toast.success("Deleted.");
  };

  const create = async () => {
    const { data } = await api.post("/education", {
      period: "2022 — 2026", degree: "New entry", institution: "",
      notes: [], order: items.length,
    });
    setItems((arr) => [...arr, data]);
  };

  return (
    <div className="space-y-6">
      <TabHeader
        title="Education & Achievements"
        caption="Timeline entries shown on the Journey section."
        right={
          <button
            type="button"
            onClick={create}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(212,175,55,0.4)] text-[#F2DDB6] hover:bg-[rgba(212,175,55,0.08)] transition-colors"
          >
            <Plus size={14} />
            <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em]">Add entry</span>
          </button>
        }
      />
      {items.map((e) => (
        <div key={e.id} className="rounded-xl border border-[rgba(255,255,255,0.06)] p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Period" value={e.period} onChange={(v) => setField(e.id, "period", v)} />
            <Field label="Degree / Title" value={e.degree} onChange={(v) => setField(e.id, "degree", v)} />
            <Field label="Institution" value={e.institution} onChange={(v) => setField(e.id, "institution", v)} />
          </div>
          <NotesInput value={e.notes || []} onChange={(v) => setField(e.id, "notes", v)} />
          <Field label="Order" type="number" value={e.order} onChange={(v) => setField(e.id, "order", Number(v) || 0)} />
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => remove(e.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,80,80,0.3)] text-red-300 hover:bg-red-500/10 transition-colors">
              <Trash2 size={14} />
              <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em]">Delete</span>
            </button>
            <button type="button" onClick={() => saveOne(e)} disabled={saving === e.id}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#D4AF37] text-black hover:bg-[#F2DDB6] transition-colors disabled:opacity-60">
              <Save size={14} />
              <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em]">{saving === e.id ? "Saving…" : "Save"}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesTab() {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/messages");
      setMsgs(data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await api.delete(`/admin/messages/${id}`);
    setMsgs((arr) => arr.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <TabHeader title="Inbox" caption="Messages from the public contact form." />
      {loading && <div className="text-zinc-500 text-sm">Loading…</div>}
      {!loading && msgs.length === 0 && (
        <div className="text-zinc-500 text-sm border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl p-8 text-center">
          No messages yet. When someone reaches out, they&apos;ll appear here.
        </div>
      )}
      <div className="space-y-4">
        {msgs.map((m) => (
          <div key={m.id} className="rounded-xl border border-[rgba(255,255,255,0.06)] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-[#D4AF37]" />
                  <span className="font-serif-display text-lg text-white">{m.name}</span>
                  <span className="text-zinc-500 text-sm">· {m.email}</span>
                </div>
                {m.subject ? <div className="mt-1 text-zinc-300 text-sm">{m.subject}</div> : null}
                <div className="mt-1 font-mono-accent text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  {new Date(m.created_at).toLocaleString()}
                </div>
              </div>
              <button type="button" onClick={() => remove(m.id)}
                className="text-zinc-500 hover:text-red-300 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="mt-4 text-zinc-300 font-light whitespace-pre-wrap">{m.message}</p>
            <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "your message"))}`}
              className="mt-4 inline-flex items-center gap-2 text-[#F2DDB6] hover:text-white transition-colors">
              <span className="font-mono-accent text-[10px] uppercase tracking-[0.28em]">Reply</span>
              <span>→</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <TabHeader title="Settings" caption="Account & access." />
      <div className="rounded-xl border border-[rgba(255,255,255,0.06)] p-6 space-y-4">
        <div className="font-serif-display text-xl text-white">How to access this page</div>
        <ul className="space-y-2 text-zinc-400 text-sm font-light">
          <li>• Direct URL: <code className="font-mono-accent text-[#F2DDB6]">/atelier</code></li>
          <li>• Global shortcut anywhere on the site: hold <code className="font-mono-accent text-[#F2DDB6]">Ctrl + Shift + Alt + Z</code>, then press <code className="font-mono-accent text-[#F2DDB6]">S</code></li>
          <li>• There is no link to this area on the public site — it is invisible to visitors.</li>
        </ul>
      </div>
      <div className="rounded-xl border border-[rgba(255,255,255,0.06)] p-6 space-y-3">
        <div className="font-serif-display text-xl text-white">Change your password</div>
        <p className="text-zinc-400 text-sm font-light">
          Your password lives in the backend environment file. Ask your engineer (or open
          <code className="font-mono-accent text-[#F2DDB6] mx-1">/app/backend/.env</code>) and change the
          <code className="font-mono-accent text-[#F2DDB6] mx-1">ADMIN_PASSWORD</code> value, then restart the backend. The
          hashed password is refreshed automatically on next boot.
        </p>
      </div>
    </div>
  );
}

// ---------- Bits ----------

function TabHeader({ title, caption, right }) {
  return (
    <div className="flex items-start justify-between gap-6 mb-2">
      <div>
        <div className="font-mono-accent text-[10px] uppercase tracking-[0.28em] text-[#F2DDB6]">Editing</div>
        <h2 className="mt-2 font-serif-display text-3xl md:text-4xl text-white">{title}</h2>
        {caption ? <p className="mt-2 text-zinc-400 text-sm font-light">{caption}</p> : null}
      </div>
      {right}
    </div>
  );
}

function SaveBar({ onSave, saving }) {
  return (
    <div className="sticky bottom-6 flex items-center justify-end pt-4">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        data-testid="atelier-save-button"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] text-black hover:bg-[#F2DDB6] transition-colors disabled:opacity-60"
      >
        <Save size={14} />
        <span className="font-mono-accent text-[11px] uppercase tracking-[0.28em]">
          {saving ? "Saving…" : "Save changes"}
        </span>
      </button>
    </div>
  );
}
