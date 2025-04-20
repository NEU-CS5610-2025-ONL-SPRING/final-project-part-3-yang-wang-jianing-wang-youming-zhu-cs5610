
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function PostList() {
    const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:8000/items")
        .then((res) => res.json())
        .then((data) => setPosts(data))
        .catch((err) => console.error("Failed to load posts:", err));
    }, []);
  
    return (
      <div className="mt-10 space-y-6">
        <h2 className="text-xl font-bold">All Posts</h2>
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded shadow">
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-48 object-cover mb-2"
              />
            )}
            <h3 className="text-lg font-semibold">{post.name}</h3>
            <p>{post.description}</p>
            <p className="text-sm text-gray-500">
              📍 {post.featuredPlace || "No location"}
            </p>
            <p className="text-sm text-yellow-600">
              ⭐ Rating: {post.rating ? post.rating.toFixed(1) : "N/A"}
            </p>
            <p className="text-xs text-gray-400">
              🕒 {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    );
  }