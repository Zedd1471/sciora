import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { theme } from "./styles/theme";
import "./styles/main.css";
import LandingPage from "./pages/LandingPage";
import StudentPage from "./pages/StudentPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./utils/ProtectedRoute";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ResourcesPage from "./pages/ResourcesPage";
import AdminResourcesUpload from './pages/AdminResourcesUpload';
import BlogPage from "./pages/BlogPage";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.main};
    margin: 0;
  }
`;

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
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/admin/resources-upload" element={<AdminResourcesUpload />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:postId" element={<BlogPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
