// frontend/src/App.js
import React from 'react';
import SearchBar from '../components/home_search_bar';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function getPlaces() {
  // Fetch all places from the database and return them as strings
  let options = [];

  fetch('http://localhost:8000/places')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Got data:', data);
    options = data;
  })
  .catch(err => {
    console.error('Fetch error:', err);
  });

  // convert list of json objects into list of strings.
  

  return options;
}

function Homepage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true });
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Error during logout:", err);
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
    <div style={pageStyle}>
      <h1 style={{
            textAlign: "center",
            color: "#4CAF50",
            fontSize: "36px",
            fontWeight: "bold",
            marginTop: "100px",
            marginBottom: "40px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            alignSelf: "center"
          }}>
        Where to?
      </h1>
      <SearchBar options={getPlaces()}/>
    </div>
  );
}

export default Homepage;


