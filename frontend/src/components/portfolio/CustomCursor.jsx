import { useEffect, useRef, useState } from "react";

/**
 * Elegant custom cursor:
 *  - a small gold dot that follows the mouse instantly
 *  - a larger ring that trails with easing
 *  - expands + inverts when hovering interactive elements
 *  - hides on touch devices
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const stateRef = useRef({
    x: -100,
    y: -100,
    rx: -100,
    ry: -100,
    hover: false,
    down: false,
    visible: false,
  });

  useEffect(() => {
    const supportsHover =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsHover) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-on");

    const s = stateRef.current;

    const onMove = (e) => {
      s.x = e.clientX;
      s.y = e.clientY;
      s.visible = true;
    };
    const onDown = () => { s.down = true; };
    const onUp = () => { s.down = false; };
    const onLeave = () => { s.visible = false; };
    const onEnter = () => { s.visible = true; };
    const onOver = (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      s.hover = !!t.closest('a, button, input, textarea, select, [role="button"], [data-cursor="hover"]');
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    let rafId;
    const loop = () => {
      // Ring eases toward the dot
      s.rx += (s.x - s.rx) * 0.18;
      s.ry += (s.y - s.ry) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) scale(${s.down ? 0.6 : 1})`;
        dotRef.current.style.opacity = s.visible ? 1 : 0;
      }
      if (ringRef.current) {
        const scale = s.hover ? 2.2 : s.down ? 0.85 : 1;
        ringRef.current.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.opacity = s.visible ? (s.hover ? 1 : 0.65) : 0;
        ringRef.current.style.borderColor = s.hover ? "#D4AF37" : "rgba(212,175,55,0.5)";
        ringRef.current.style.backgroundColor = s.hover ? "rgba(212,175,55,0.08)" : "transparent";
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("custom-cursor-on");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid rgba(212,175,55,0.5)",
          pointerEvents: "none",
          zIndex: 2147483646,
          transition: "opacity 200ms ease, border-color 200ms ease, background-color 200ms ease",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#F2DDB6",
          boxShadow: "0 0 12px rgba(212,175,55,0.65)",
          pointerEvents: "none",
          zIndex: 2147483647,
          transition: "opacity 200ms ease",
        }}
      />
    </>
  );
}
