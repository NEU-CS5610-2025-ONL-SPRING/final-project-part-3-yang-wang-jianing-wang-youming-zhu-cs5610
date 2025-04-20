import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div style={{
      width: "200px",
      backgroundColor: "#f9f9f9",
      height: "100vh",
      padding: "20px",
      boxSizing: "border-box"
    }}>
      {!isLoggedIn ? (
        <button onClick={handleLoginClick}>Login</button>
      ) : (
        <>
          <button
            onClick={() => navigate("/make-post")}
            style={{ display: "block", marginBottom: "10px" }}
          >
            Add Post
          </button>
          <button onClick={onLogout}>Logout</button>
        </>
      )}
    </div>
  );
}

export default Sidebar;