import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../api/api";

function PostDetail({ isLoggedIn }) {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    const fetchPost = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/items/${id}`);
            const data = await res.json();
            setPost(data);
            setLikes(data.likeCount || 0);
            setDislikes(data.dislikeCount || 0);
        } catch (err) {
            console.error("Error loading post:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    if (!isLoggedIn) {
        return <p style={{ padding: '24px' }}>⚠️ You must login to view this post.</p>;
    }

    if (loading) return <p style={{ padding: '24px' }}>Loading post...</p>;
    if (!post) return <p style={{ padding: '24px' }}>Post not found.</p>;

    const handleLike = async () => {
        try {
            const res = await fetch("${API_BASE_URL}/like", {
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

            if (res.ok) {
                const data = await res.json();
                setLikes(data.likeCount);
                setDislikes(data.dislikeCount);
                if (liked) {
                    setLiked(false);
                } else {
                    setLiked(true);
                    setDisliked(false);
                }
            }
        } catch (err) {
            console.error("Error liking post:", err);
        }
    };

    const handleDislike = async () => {
        try {
            const res = await fetch("${API_BASE_URL}/like", {
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

            if (res.ok) {
                const data = await res.json();
                setLikes(data.likeCount);
                setDislikes(data.dislikeCount);
                if (disliked) {
                    setDisliked(false);
                } else {
                    setDisliked(true);
                    setLiked(false);
                }
            }
        } catch (err) {
            console.error("Error disliking post:", err);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 1, padding: '24px', display: 'flex', backgroundColor: '#fff' }}>
                <div style={{ flex: 1 }}>
                    <img src={post.imageUrl} alt={post.name} style={{ width: '100%', borderRadius: '10px' }} />
                </div>
                <div style={{ width: '50%', padding: '0 24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', color: '#000' }}>
                    <h2 style={{ margin: '8px 0' }}>{post.name}</h2>
                    <p style={{ fontSize: '15px', marginBottom: '20px' }}>{post.description}</p>
                    <p style={{ color: '#888', fontSize: '13px' }}>
                        📍 {post.featuredPlace || 'Unknown'}{post.rating ? ` · ⭐ ${post.rating}` : ""} · 🕓 {new Date(post.createdAt).toLocaleString()}
                    </p>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
                        <div onClick={handleLike} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '18px', color: liked ? 'blue' : 'gray', marginRight: '6px' }}>
                                👍
                            </span>
                            <span>{likes}</span>
                        </div>
                        <div onClick={handleDislike} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '18px', color: disliked ? '#666' : 'gray', marginRight: '6px' }}>👎</span>
                            <span>{dislikes}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;
