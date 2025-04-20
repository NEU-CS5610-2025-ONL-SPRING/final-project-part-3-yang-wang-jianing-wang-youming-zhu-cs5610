// frontend/src/App.js
import React from 'react';
import SearchBar from '../components/home_search_bar';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import API_BASE_URL from "./api/api";


function Homepage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <h1 className="text-5xl sm:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-lime-500 to-emerald-500 tracking-wide mb-6">
        Where to?
      </h1>
      <div className="w-full max-w-xl">
        <SearchBar />
      </div>
    </div>
  );
}

export default Homepage;


