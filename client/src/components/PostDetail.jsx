import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PostDetail({ isLoggedIn }) {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:8000/items/${id}`);
                const data = await res.json();
                setPost(data);
            } catch (err) {
                console.error("Error loading post:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (!isLoggedIn) {
        return <p style={{ padding: '24px' }}>⚠️ You must login to view this post.</p>;
    }

    if (loading) return <p style={{ padding: '24px' }}>Loading post...</p>;
    if (!post) return <p style={{ padding: '24px' }}>Post not found.</p>;

    const handleLike = () => {
        if (!liked) {
            setLikes(likes + 1);
            if (disliked) {
                setDislikes(dislikes - 1);
                setDisliked(false);
            }
            setLiked(true);
        } else {
            setLikes(likes - 1);
            setLiked(false);
        }
    };

    const handleDislike = () => {
        if (!disliked) {
            setDislikes(dislikes + 1);
            if (liked) {
                setLikes(likes - 1);
                setLiked(false);
            }
            setDisliked(true);
        } else {
            setDislikes(dislikes - 1);
            setDisliked(false);
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
                            <span style={{ fontSize: '18px', color: liked ? 'red' : 'gray', marginRight: '6px' }}>{liked ? '❤️' : '🤍'}</span>
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
