import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/api";


export default function AddItem() {
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/items`, formData, {
        withCredentials: true,
      });
      alert("Item added successfully!");
      setFormData({ name: "", description: "" }); // Reset form
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add item!");
    }
  };

  return (
    <div>
      <h2>Add Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Item Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}
