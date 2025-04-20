// export default PostsGrid;
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from './PostCard';
import API_BASE_URL from "../api/api";


function PostsGrid({ isLoggedIn }) {
    const [posts, setPosts] = useState([]);
    const [searchParams] = useSearchParams();
    const place = searchParams.get("place");

    useEffect(() => {
        if (place) {
            console.log("📍 Searching for:", place);

            fetch(`${API_BASE_URL}/search?place=${encodeURIComponent(place)}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log("✅ Received:", data);

                    if (Array.isArray(data)) {
                        setPosts(data);
                    } else {
                        console.error("❌ Expected array but got:", data);
                        setPosts([]);
                    }
                })
                .catch((err) => {
                    console.error("❌ Fetch error:", err);
                    setPosts([]);
                });
        }
    }, [place]);

    return (
        <div className="px-8 py-4">
            <h2 className="text-xl font-bold mb-4">
                Results for <span className="text-green-600">"{place}"</span>
            </h2>

            {Array.isArray(posts) && posts.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
                    ))}
                </div>
            ) : (
                <p>No posts found for this location.</p>
            )}
        </div>
    );
}

export default PostsGrid;
