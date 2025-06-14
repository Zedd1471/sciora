import React from "react";

const LandingPage: React.FC<{ onEnter?: () => void }> = ({ onEnter }) => {
  const handleEnterClassroom = () => {
    if (onEnter) {
      onEnter();
    } else {
      window.location.href = "/student"; // Change to your portal route if needed
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: `linear-gradient(120deg,rgb(223, 183, 23) 10%, #e3eafc 100%)`,
        backgroundImage:
          'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          background: "rgba(12, 118, 189, 0.30)",
          borderRadius: 8,
          boxShadow: "0 8px 32px rgba(44,62,80,0.18)",
          padding: "3rem 2.5rem",
          maxWidth: 420,
          width: "90%",
          textAlign: "center",
          backdropFilter: "blur(6px)",
        }}
      >
        <h1
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            color: "#2d3e50",
            marginBottom: 8,
            letterSpacing: 1,
          }}
        >
          Sciora
        </h1>
        <p style={{ color: "#444", marginBottom: 32, fontSize: "1.1rem" }}>
          Welcome to a smarter way to learn!
        </p>
        <button
          style={{
            background: "#4f8cff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "1rem 2.5rem",
            fontWeight: "bold",
            fontSize: "1.15rem",
            boxShadow: "0 2px 8px #4f8cff22",
            cursor: "pointer",
            letterSpacing: 1,
            transition: "background 0.2s",
          }}
          onClick={handleEnterClassroom}
        >
          Enter Classroom
        </button>
      </div>
    </div>
  );
};

export default LandingPage;