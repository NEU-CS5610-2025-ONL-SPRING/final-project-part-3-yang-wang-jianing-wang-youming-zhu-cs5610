// import React, { useState, useEffect } from 'react';
// import PostCard from './PostCard';

// function PostsGrid({ isLoggedIn }) {
//     const [posts, setPosts] = useState([]);

//     useEffect(() => {
//         const dummyPosts = [
//             {
//                 id: 1,
//                 title: 'Post 1',
//                 imageUrl: 'https://picsum.photos/300/200?random=1',
//                 content: 'Content for Post 1'
//             },
//             {
//                 id: 2,
//                 title: 'Post 2',
//                 imageUrl: 'https://picsum.photos/300/200?random=2',
//                 content: 'Content for Post 2'
//             },
//             {
//                 id: 3,
//                 title: 'Post 3',
//                 imageUrl: 'https://picsum.photos/300/200?random=3',
//                 content: 'Content for Post 3'
//             },
//             {
//                 id: 4,
//                 title: 'Post 4',
//                 imageUrl: 'https://picsum.photos/300/200?random=4',
//                 content: 'Content for Post 4'
//             },
//         ];

//         setPosts(dummyPosts);
//     }, []);

//     return (
//         <>

//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' }}>
//             {posts.map(post => (
//                 <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
//             ))}
//         </div>
//         </>

//     );
// }

// export default PostsGrid;
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from './PostCard';

function PostsGrid({ isLoggedIn }) {
    const [posts, setPosts] = useState([]);
    const [searchParams] = useSearchParams();
    const place = searchParams.get("place");

    useEffect(() => {
        if (place) {
            console.log("📍 Searching for:", place);

            fetch(`http://localhost:8000/search?place=${encodeURIComponent(place)}`)
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
