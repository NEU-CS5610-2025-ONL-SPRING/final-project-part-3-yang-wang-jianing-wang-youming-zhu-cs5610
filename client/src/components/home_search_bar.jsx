import React, { useState, useRef, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';

// function SearchBar() {
//   const [query, setQuery] = useState('');
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();

//     const trimmed = query.trim();
//     if (trimmed) {
//       // navigate(`/search-results?place=${encodeURIComponent(trimmed)}`);
//       navigate(`/search?place=${encodeURIComponent(trimmed)}`);
//     }
//   };

//   return (
//     <div className="flex justify-center mt-8">
//       <form
//         onSubmit={handleSearch}
//         className="flex w-full max-w-xl rounded shadow overflow-hidden"
//       >
//         <input
//           type="text"
//           placeholder="Search locations..."
//           className="flex-grow p-3 border border-green-500 focus:outline-none"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="bg-green-500 text-white px-6 py-3 font-semibold hover:bg-green-600 transition"
//         >
//           Search
//         </button>
//       </form>
//     </div>
//   );
// }

// export default SearchBar;


function SearchBar({ options }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef();

  // filter whenever query or options change
  useEffect(() => {
    const q = query.trim().toLowerCase();
    setFiltered(
      q
        ? options.filter(opt => opt.toLowerCase().includes(q))
        : []
    );
  }, [query, options]);

  // close dropdown if you click outside
  useEffect(() => {
    function onClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSelect = place => {
    setQuery(place);
    setIsOpen(false);
    navigate(`/search?place=${encodeURIComponent(place)}`);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) navigate(`/search?place=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div ref={containerRef} className="w-full max-w-xl mx-auto relative">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          placeholder="Search locations..."
          className="flex-grow p-3 border border-green-500 focus:outline-none rounded-l"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 font-semibold hover:bg-green-600 transition rounded-r"
        >
          Search
        </button>
      </form>

      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-auto rounded">
          {filtered.map((opt, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;

