import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from "../config/api";


function PostCard({ post, isLoggedIn }) {
    const [likes, setLikes] = useState(post.likeCount || 0);
    const [dislikes, setDislikes] = useState(post.dislikeCount || 0);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);


    const handleLike = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return alert("Please login");

        try {
            const res = await fetch(`${API_BASE_URL}/like`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    itemId: post.id,
                    isLike: true
                })
            });

            const data = await res.json();
            if (res.ok) {
                setLiked(!liked);
                setDisliked(false);
                setLikes(data.likeCount);
                setDislikes(data.dislikeCount);
            } else {
                console.error("Failed to like:", data.error);
            }
        } catch (err) {
            console.error("Request error:", err);
        }
    };



    const handleDislike = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return alert("Please login");

        try {
            const res = await fetch(`${API_BASE_URL}/like`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    itemId: post.id,
                    isLike: false
                })
            });

            const data = await res.json();
            if (res.ok) {
                setDisliked(!disliked);
                setLiked(false);
                setLikes(data.likeCount);
                setDislikes(data.dislikeCount);
            } else {
                console.error("Failed to dislike:", data.error);
            }
        } catch (err) {
            console.error("Request error:", err);
        }
    };


    return (
        <div
            style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center',
                position: 'relative',
                color: '#000',
                backgroundColor: '#fff'
            }}
        >
            <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img
                    src={post.imageUrl}
                    alt={post.name}
                    style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '5px'
                    }}
                />
                <h3 style={{ margin: '15px 0 10px' }}>{post.name}</h3>
                <p style={{ color: '#555', fontSize: '14px' }}>{post.description}</p>
                {post.featuredPlace && (
                    <p style={{ fontSize: '13px', color: '#888' }}>📍 {post.featuredPlace}</p>
                )}
                {post.rating !== null && (
                    <p style={{ fontSize: '13px', color: '#f59e0b' }}>⭐ {post.rating}</p>
                )}
                <p style={{ fontSize: '12px', color: '#bbb' }}>
                    🕒 {new Date(post.createdAt).toLocaleString()}
                </p>
            </Link>

            <div
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <div
                    onClick={handleLike}
                    style={{
                        cursor: 'pointer',
                        marginRight: '10px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <span style={{ fontSize: '18px', color: liked ? 'blue' : 'gray', marginRight: '6px' }}>
                        👍
                    </span>
                    <span>{likes}</span>
                </div>
                <div
                    onClick={handleDislike}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <span style={{ fontSize: '18px', color: disliked ? '#666' : 'gray', marginRight: '6px' }}>
                        👎
                    </span>
                    <span>{dislikes}</span>
                </div>
            </div>
        </div>
    );
}

export default PostCard;
