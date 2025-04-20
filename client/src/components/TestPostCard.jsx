import React from 'react';
import PostCard from './PostCard';

function TestPostCard() {
    const dummyPost = {
        id: 1,
        title: 'Sample Post Title',
        imageUrl: 'https://picsum.photos/300/200', // placeholder image
        content: 'This is a sample content of the post. It shows how the post content will appear.'
    };

    return (
        <div style={{ width: '300px', margin: '50px auto' }}>
            <PostCard post={dummyPost} />
        </div>
    );
}

export default TestPostCard;
