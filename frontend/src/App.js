import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "@/pages/Portfolio";
import Atelier from "@/pages/Atelier";
import LoginModal from "@/components/portfolio/LoginModal";
import CustomCursor from "@/components/portfolio/CustomCursor";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

/**
 * Secret shortcut: Ctrl + Shift + Alt + Z, then S (within 1.5s).
 * Holding all three modifiers and pressing Z "arms" the shortcut,
 * pressing S right after opens the private login modal.
 */
function GlobalShortcut({ onOpen }) {
  useEffect(() => {
    let armed = false;
    let armTimer = null;

    const disarm = () => {
      armed = false;
      if (armTimer) {
        clearTimeout(armTimer);
        armTimer = null;
      }
    };

    const onKey = (e) => {
      const mods = e.ctrlKey && e.shiftKey && e.altKey;
      const key = (e.key || "").toLowerCase();

      if (mods && key === "z") {
        e.preventDefault();
        armed = true;
        if (armTimer) clearTimeout(armTimer);
        armTimer = setTimeout(disarm, 1500);
        return;
      }

      if (armed && key === "s") {
        e.preventDefault();
        disarm();
        onOpen();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      disarm();
    };
  }, [onOpen]);
  return null;
}

function App() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="App grain">
      <AuthProvider>
        <BrowserRouter>
          <CustomCursor />
          <GlobalShortcut onOpen={() => setLoginOpen(true)} />
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/atelier" element={<Atelier openLogin={() => setLoginOpen(true)} />} />
          </Routes>
          <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        </BrowserRouter>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(8,17,31,0.92)",
              border: "1px solid rgba(212,175,55,0.3)",
              color: "#F2F2F2",
              backdropFilter: "blur(20px)",
            },
          }}
        />
      </AuthProvider>
    </div>
  );
}

export default App;
