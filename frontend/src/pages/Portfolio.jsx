import { useEffect, useState } from "react";
import Lenis from "lenis";
import api from "@/lib/api";
import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import Marquee from "@/components/portfolio/Marquee";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Education from "@/components/portfolio/Education";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";

export default function Portfolio() {
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [s, p, ed] = await Promise.all([
          api.get("/profile/settings"),
          api.get("/projects"),
          api.get("/education"),
        ]);
        setSettings(s.data);
        setProjects(p.data);
        setEducation(ed.data);
      } catch (e) {
        // silent — hero falls back to defaults
      }
    })();
  }, []);

  return (
    <main data-testid="portfolio-page" className="relative">
      <Navbar settings={settings} />
      <Hero settings={settings} />
      <Marquee />
      <About settings={settings} />
      <Skills />
      <Projects projects={projects} />
      <Education items={education} />
      <Contact settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
