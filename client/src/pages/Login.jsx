import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/auth/login", formData, { withCredentials: true });
      onLogin(); // Update login state
      navigate("/"); // Redirect to homepage
    } catch (err) {
      setLoginMessage(err.response?.data?.error || "Login failed!");
    }
  };

  const pageStyle = {
    // make the div fill the viewport
    minHeight: '100vh',
    margin: 0,
    // set your background image (or swap for a color)
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${process.env.PUBLIC_URL + '/homepage_background.jpg'})`,
    backgroundColor: '#FFFFFFFF',
    backgroundPosition: 'center',    // center the image
    backgroundSize: 'cover',         // scale to cover the whole area
    backgroundRepeat: 'no-repeat',   // prevent tiling
    display: 'flex',                 // center content too
    flexDirection: 'column',

  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh", 
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${process.env.PUBLIC_URL + '/homepage_background.jpg'})`,
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundColor: '#FFFFFFFF',
      backgroundRepeat: 'no-repeat',
      }}>
      <div style={{ width: "400px", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff" }}>
        <h1
          style={{
            textAlign: "center",
            color: "#4CAF50",
            fontSize: "36px",
            fontWeight: "bold",
            marginBottom: "20px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Wanderlust
        </h1>
        <p style={{ textAlign: "center", marginBottom: "20px" }}>Enter your login credentials</p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
        {loginMessage && <p style={{ textAlign: "center", marginTop: "10px", color: loginMessage === "Login successful!" ? "green" : "red" }}>{loginMessage}</p>}
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Not registered? <Link to="/register" style={{ color: "#4CAF50", textDecoration: "none" }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
