// FilterComponent.jsx
import React, { useState } from "react";

const FilterComponent = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState("");

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="flex space-x-2 my-4">
      <button
        onClick={() => handleFilterClick("recent")}
        className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
          activeFilter === "recent"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-600 hover:bg-gray-700"
        }`}
      >
        Recent
      </button>
      <button
        onClick={() => handleFilterClick("upvotes")}
        className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
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
