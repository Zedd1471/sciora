import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./styles/main.css";
import LandingPage from "./pages/LandingPage";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("config", "G-6PJ8695TH3", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
