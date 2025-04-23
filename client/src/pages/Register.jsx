import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    retypePassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!usernameRegex.test(formData.username)) {
      alert("Invalid username format. Must be 3-20 characters and contain only letters, numbers, or underscores.");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      alert("Invalid email format.");
      return false;
    }
    if (!passwordRegex.test(formData.password)) {
      alert("Password must be at least 8 characters long and contain at least one letter and one number.");
      return false;
    }
    if (formData.password !== formData.retypePassword) {
      alert("Passwords do not match!");
      return false;
    }
    return true;
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { retypePassword, ...dataToSend } = formData;
      const res = await axios.post(`${API_BASE_URL}/auth/register`, dataToSend, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed!");
    }
  };

  return (
    <div style={{ display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "100vh", 
    // set your background image (or swap for a color)
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${process.env.PUBLIC_URL + '/homepage_background.jpg'})`,
    backgroundColor: '#FFFFFFFF',
    backgroundPosition: 'center',    // center the image
    backgroundSize: 'cover',         // scale to cover the whole area
    backgroundRepeat: 'no-repeat',   // prevent tiling
    display: 'flex',                 // center content too
    flexDirection: 'column', }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "400px",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#4CAF50", marginBottom: "20px", fontSize: "25px" }}>Registration Form</h2>
        <div style={{ marginBottom: "15px" }}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Re-type Password:</label>
          <input
            type="password"
            name="retypePassword"
            placeholder="Re-type Password"
            value={formData.retypePassword}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div >
  );
}
