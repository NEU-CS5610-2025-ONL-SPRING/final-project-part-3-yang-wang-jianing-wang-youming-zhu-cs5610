import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?place=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <form
        onSubmit={handleSearch}
        className="flex w-full max-w-xl rounded shadow overflow-hidden"
      >
        <input
          type="text"
          placeholder="Search locations..."
          className="flex-grow p-3 border border-green-500 focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 font-semibold hover:bg-green-600 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
