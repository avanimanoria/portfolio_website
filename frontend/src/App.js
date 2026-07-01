import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "@/pages/Portfolio";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="App grain">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(10,10,10,0.9)",
            border: "1px solid rgba(212,175,55,0.3)",
            color: "#F2F2F2",
            backdropFilter: "blur(20px)",
          },
        }}
      />
    </div>
  );
}

export default App;
