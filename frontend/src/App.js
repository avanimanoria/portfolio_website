import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "@/pages/Portfolio";
import Atelier from "@/pages/Atelier";
import LoginModal from "@/components/portfolio/LoginModal";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

function GlobalShortcut({ onOpen }) {
  useEffect(() => {
    const onKey = (e) => {
      // Ctrl/Cmd + Shift + A → open admin login modal
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpen]);
  return null;
}

function App() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="App grain">
      <AuthProvider>
        <BrowserRouter>
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
