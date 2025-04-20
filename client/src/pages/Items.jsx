import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

export default function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get(`${API_BASE_URL}/items`);
      setItems(res.data);
    };
    fetchItems();
  }, []);

  return (
    <div>
      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}: {item.description}</li>
        ))}
      </ul>
    </div>
  );
}
