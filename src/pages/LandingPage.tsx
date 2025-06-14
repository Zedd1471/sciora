import React from "react";
import { motion } from "framer-motion";

const LandingPage: React.FC<{ onEnter?: () => void }> = ({ onEnter }) => {
  const handleEnterClassroom = () => {
    if (onEnter) {
      onEnter();
    } else {
      window.location.href = "/student";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage:
          'url("https://images.unsplash.com/photo-1648792940059-3b782a7b8b20?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Optional dark overlay for better contrast */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: "relative",
          zIndex: 2,
          background: "rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          padding: "3rem 2.5rem",
          maxWidth: 640,
          width: "95%",
          textAlign: "center",
          backdropFilter: "blur(14px)",
        }}
      >
        <h1
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "2.75rem",
            fontWeight: 800,
            color: "#fff",
            marginBottom: "1.25rem",
            letterSpacing: 1,
            textShadow: "0 2px 4px rgba(0,0,0,0.4)",
          }}
        >
          Sciora
        </h1>

        <p
          style={{
            color: "#f0f0f0",
            marginBottom: "2.5rem",
            fontSize: "1.25rem",
            fontWeight: 500,
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Live. Learn. Excel
        </p>

        <button
          onClick={handleEnterClassroom}
          style={{
            background: "linear-gradient(135deg, #4f8cff, #1d73ff)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "1.2rem 3rem",
            fontWeight: "bold",
            fontSize: "1.2rem",
            fontFamily: "'Montserrat', sans-serif",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            cursor: "pointer",
            letterSpacing: 1,
            transition: "all 0.3s ease",
            transform: "scale(1)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #3d7cff, #0f5fff)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #4f8cff, #1d73ff)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Enter Classroom →
        </button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
