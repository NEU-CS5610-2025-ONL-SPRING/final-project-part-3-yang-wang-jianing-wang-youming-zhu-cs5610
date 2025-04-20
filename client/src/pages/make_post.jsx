import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config/api";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Step 1: Get current user ID
    fetch(`${API_BASE_URL}/auth/current-user`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((user) => {
        setUserId(user.id);
        return fetch(`${API_BASE_URL}/items?userId=${user.id}`, {
          credentials: "include",
        });
      })
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Failed to load posts:", err));
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/items/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      alert("Failed to delete post.");
      console.error(err);
    }
  };

  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-xl font-bold">My Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="p-4 border rounded shadow relative">
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
          <button
            onClick={() => handleDelete(post.id)}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default function PostForm() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", title);
    formData.append("description", content);
    formData.append("featuredPlace", hashtags);

    try {
      const res = await fetch(`${API_BASE_URL}/items`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("❌ Backend error:", result);
        throw new Error("Post creation failed.");
      }

      alert("✅ Post submitted successfully!");
      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);
      setHashtags("");
    } catch (err) {
      console.error("❌ Submit failed:", err);
      alert("Failed to submit post.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-6 gap-6 max-w-7xl mx-auto">
      <div className="flex-1 space-y-4">
        <div className="border p-4 rounded">
          <label className="block mb-2 font-medium">Upload image</label>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="preview"
              className="h-40 object-contain mb-2"
            />
          ) : (
            <div className="w-full h-40 border border-dashed flex items-center justify-center text-gray-400">
              No image selected
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your content here..."
            className="w-full p-2 border rounded"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Featured Place</label>
          <input
            type="text"
            placeholder="e.g. restaurant, tourist spot"
            className="w-full p-2 border rounded"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Submit Post
          </button>
        </div>
      </div>

      <div className="flex-1">
        <PostList />
      </div>
    </div>
  );
}
