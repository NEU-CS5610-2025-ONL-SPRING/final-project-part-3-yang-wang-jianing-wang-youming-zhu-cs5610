import React from 'react';
import { render, screen } from '@testing-library/react';
import PostCard from './PostCard';
import { MemoryRouter } from 'react-router-dom';

const mockPost = {
    id: 'abc123',
    name: 'Sunny Beach',
    description: 'A beautiful sunny beach to relax.',
    imageUrl: 'https://example.com/beach.jpg',
    featuredPlace: 'California',
    rating: 4.5,
    createdAt: new Date().toISOString(),
    likeCount: 5,
    dislikeCount: 2,
};

test('renders PostCard with correct content', () => {
    render(
        <MemoryRouter>
            <PostCard post={mockPost} isLoggedIn={true} />
        </MemoryRouter>
    );

    // Check title, description, image, featured place
    expect(screen.getByText('Sunny Beach')).toBeInTheDocument();
    expect(screen.getByText(/A beautiful sunny beach/i)).toBeInTheDocument();
    expect(screen.getByAltText('Sunny Beach')).toHaveAttribute('src', mockPost.imageUrl);
    expect(screen.getByText(/📍 California/)).toBeInTheDocument();

    // Check like/dislike icons exist
    expect(screen.getByText('👍')).toBeInTheDocument();
    expect(screen.getByText('👎')).toBeInTheDocument();
});
