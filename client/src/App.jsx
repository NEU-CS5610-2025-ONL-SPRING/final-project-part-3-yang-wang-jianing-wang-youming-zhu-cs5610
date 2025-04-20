import { useState, useEffect } from "react";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import PostsGrid from "./components/PostsGrid";
import Sidebar from "./components/Sidebar";
import PostDetail from "./components/PostDetail";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Items from "./pages/Items";
import AddItem from "./pages/AddItem";
import PostForm from "./pages/make_post";

const API_BASE_URL = "https://final-project-part-3-yang-wang-jianing.onrender.com";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("${API_BASE_URL}/auth/check", { withCredentials: true });
        setIsLoggedIn(res.data.isAuthenticated);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = async () => {
    try {
      await axios.post("${API_BASE_URL}/auth/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Router>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<PostsGrid isLoggedIn={isLoggedIn} />} />
            <Route path="/post/:id" element={<PostDetail isLoggedIn={isLoggedIn} />} />


            {/* Protected Routes */}
            {isLoggedIn ? (
              <>

                <Route path="/items" element={<Items />} />
                <Route path="/add-item" element={<AddItem />} />
                <Route path="/make-post" element={<PostForm />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;