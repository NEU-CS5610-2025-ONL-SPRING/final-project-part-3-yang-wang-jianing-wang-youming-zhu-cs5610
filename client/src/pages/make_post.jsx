// import React, { useState } from "react";

// export default function PostForm() {
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [hashtags, setHashtags] = useState("");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const postData = {
//       name: title,
//       description: content,
//       featuredPlace: hashtags,
//       imageUrl: "https://via.placeholder.com/300", // 临时图片链接，之后替换为真实上传结果
//     };

//     try {
//       const res = await fetch("http://localhost:8000/items", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         credentials: "include", // token
//         body: JSON.stringify(postData),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to submit post");
//       }

//       const result = await res.json();
//       console.log("✅ Post submitted:", result);
//       alert("Post submitted successfully!");
//     } catch (error) {
//       console.error("❌ Submit failed:", error);
//       alert("Something went wrong while submitting the post.");
//     }
//   };


//   return (
//     <div className="flex flex-col lg:flex-row p-6 gap-6 max-w-7xl mx-auto">
//       {/* Left side form */}
//       <div className="flex-1 space-y-4">


//         {/* Image upload */}
//         <div className="border p-4 rounded">
//           <label className="block mb-2 font-medium">upload image (1/18)</label>
//           {imagePreview ? (
//             <img
//               src={imagePreview}
//               alt="preview"
//               className="h-40 object-contain mb-2"
//             />
//           ) : (
//             <div className="w-full h-40 border border-dashed flex items-center justify-center text-gray-400">
//               No image
//             </div>
//           )}
//           <input type="file" accept="image/*" onChange={handleImageChange} />
//         </div>

//         {/* Content */}
//         <div>
//           <input
//             type="text"
//             placeholder="Title"
//             className="w-full p-2 border rounded mb-2"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//           <textarea
//             placeholder="input text"
//             className="w-full p-2 border rounded"
//             rows={6}
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//           />
//         </div>

//         {/* Hashtags */}
//         <div>
//           <label className="block font-medium mb-1">Featured Place</label>
//           <input
//             type="text"
//             placeholder="restaurant name, tourist attraction name, etc."
//             className="w-full p-2 border rounded"
//             value={hashtags}
//             onChange={(e) => setHashtags(e.target.value)}
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-4 mt-4">
//           <button
//             onClick={handleSubmit}
//             className="bg-red-500 text-white px-4 py-2 rounded"
//           >
//             Submit
//           </button>
//         </div>
//       </div>


//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import PostList from './PostList'



export default function PostForm() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      name: title,
      description: content,
      featuredPlace: hashtags,
      imageUrl: "https://via.placeholder.com/300",
    };

    try {
      const res = await fetch("http://localhost:8000/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("❌ Backend error:", result);
        throw new Error("Post creation failed");
      }

      console.log("✅ Post created:", result);
      alert("🎉 Post submitted!");
      navigate(`/post/${result.id}`);
    } catch (err) {
      console.error("❌ Submit failed:", err);
      alert("Failed to submit post.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-6 gap-6 max-w-7xl mx-auto">
      <div className="flex-1 space-y-4">
        {/* Image upload */}
        <div className="border p-4 rounded">
          <label className="block mb-2 font-medium">Upload image (1/18)</label>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="preview"
              className="h-40 object-contain mb-2"
            />
          ) : (
            <div className="w-full h-40 border border-dashed flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Content */}
        <div>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Input text"
            className="w-full p-2 border rounded"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Hashtags */}
        <div>
          <label className="block font-medium mb-1">Featured Place</label>
          <input
            type="text"
            placeholder="restaurant name, tourist attraction name, etc."
            className="w-full p-2 border rounded"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Post List */}
      {/* 
      <div className="flex-1">
        <PostList />
      </div>
       */}
    </div>
  );
}
