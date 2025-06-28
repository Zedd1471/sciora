import React from "react";

const Header: React.FC = () => (
  <header
    style={{
      width: "10%",
      padding: "0rem 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
    }}
  >
    <span
      style={{
        fontWeight: 400,
        fontSize: "2.5rem",
        color: "#2d3e50",
        letterSpacing: 1,
      }}
    >
      Sciora
    </span>
  </header>
);

export default Header;
