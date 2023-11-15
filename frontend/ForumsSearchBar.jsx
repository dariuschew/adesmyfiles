// ForumsSearchBar.jsx
import React, { useState } from "react";

const ForumsSearchBar = ({
  value,
  onChange,
  onSearchTypeChange,
  onSearchSubmit,
  onClearSearch,
}) => {
  const [searchType, setSearchType] = useState("title");

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    onSearchTypeChange(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit();
  };

  const handleClearSearch = () => {
    onClearSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center mb-4">
      <div className="flex justify-center mb-4">
        <div className="flex w-full max-w-4xl border border-gray-300 rounded-md shadow-sm overflow-hidden bg-white">
          <div className="flex items-center justify-center pl-3 pr-2 border-r">
            <button
              type="submit"
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            >
              {/* Search Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 4a8 8 0 1016 0v12a8 8 0 10-16 0zM8 4a8 8 0 018-8"
                />
              </svg>
            </button>
          </div>
          <input
            type="text"
            className="py-2 text-sm text-black bg-white flex-1 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Search by ${searchType}`}
            autoComplete="off"
            value={value}
            onChange={onChange}
          />
          {value && (
            <div className="flex items-center justify-center pr-3">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-800"
                onClick={handleClearSearch}
              >
                {/* Clear Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          <select
            value={searchType}
            onChange={handleSearchTypeChange}
            className="bg-white text-gray-700 py-2 pl-3 pr-8 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="title">Title</option>
            <option value="tags">Tags</option>
          </select>
        </div>
      </div>
    </form>
  );
};

export default ForumsSearchBar;
