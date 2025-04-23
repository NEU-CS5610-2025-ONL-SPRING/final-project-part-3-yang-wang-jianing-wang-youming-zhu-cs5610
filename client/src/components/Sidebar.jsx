import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px 15px",
    marginBottom: "12px",
    backgroundColor: "#4ade80", // green-400
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "background-color 0.2s ease",
  };

  return (
    <div
      style={{
        width: "200px",
        backgroundColor: "#f4f4f4",
        height: "100vh",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {!isLoggedIn ? (
        <button style={buttonStyle} onClick={handleLoginClick}>
          Login
        </button>
      ) : (
        <>
          <button
            onClick={() => navigate("/make-post")}
            style={buttonStyle}
          >
            ➕ Add Post
          </button>
          <button onClick={onLogout} style={buttonStyle}>
            🚪 Logout
          </button>
        </>
      )}
    </div>
  );
}

export default Sidebar;
