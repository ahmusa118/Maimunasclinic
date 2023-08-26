import React, { useState, useEffect } from 'react';

const Search = ({ onClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async (event) => {
    setSearchTerm(event.target.value);
    const response = await fetch(`http://localhost:4000/api/search?term=${event.target.value}`);

    if (response.ok) {
      const data = await response.json();
      setResults(data);
      setShowDropdown(true);
    } else {
      console.error('Search failed');
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setShowDropdown(false);
      setResults([]);
    }
  }, [searchTerm]);

  return (
    <div className="Search">
      <input
        type="search"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search..."
        className="search-input"
      />
      {showDropdown && (
        <div className="dropdown">
          {results.map((item, index) => (
            <div key={index} className="dropdown-item" onClick={() => onClick(item._id)}>
              {item.name} in {item.subcategory}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
