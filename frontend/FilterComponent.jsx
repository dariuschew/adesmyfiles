import React from "react";

const FilterComponent = ({ activeFilter, onFilterChange }) => {
  const handleFilterClick = (filter) => {
    const newFilter = activeFilter === filter ? "" : filter;
    onFilterChange(newFilter); 
  };

  return (
    <div className="flex space-x-2 my-4">
      <button
        onClick={() => handleFilterClick("recent")}
        className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
          activeFilter === "recent"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-600 hover:bg-gray-700"
        }`}
      >
        Recent
      </button>
      <button
        onClick={() => handleFilterClick("upvotes")}
        className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
          activeFilter === "upvotes"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-600 hover:bg-gray-700"
        }`}
      >
        By Upvotes
      </button>
    </div>
  );
};

export default FilterComponent;
