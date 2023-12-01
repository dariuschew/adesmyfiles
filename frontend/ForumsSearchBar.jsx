//state management 
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

  const handleClearSearch = (event) => {
    event.preventDefault();
    onClearSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center my-4 mb-4">
      <div className="flex w-full max-w-4xl p-4">
        <div className="flex w-full border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md">
          <button
            type="submit"
            className="flex items-center justify-center px-3 border-r focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50"
          >
            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.5 14.5L19 18m-6.5-4a4.5 4.5 0 11-4.5-4.5 4.5 4.5 0 014.5 4.5z"
              />
            </svg>
          </button>
          <input
            type="text"
            className="w-full py-2 text-sm text-gray-700 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Search by ${searchType}`}
            autoComplete="off"
            value={value}
            onChange={onChange}
          />
          {value && (
            <button
              type="button"
              className="flex items-center justify-center px-3 hover:text-gray-800 focus:outline-none"
              onClick={handleClearSearch}
            >
              {/* Clear Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <select
            value={searchType}
            onChange={handleSearchTypeChange}
            className="bg-white text-gray-700 py-2 pl-2 pr-6 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
