//state management
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

const TopContributors = () => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const fetchTopContributors = async () => {
      try {
        const response = await axios.get(`${API_URL}/top-contributors`);
        setContributors(response.data);
      } catch (error) {
        console.error("Error fetching top contributors:", error);
      }
    };

    fetchTopContributors();
  }, []);

  return (
    <div className="my-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Top Contributors
      </h3>
      <div className="mt-2 grid grid-cols-1 gap-5">
        {contributors.map((contributor, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-row gap-2 items-center">
                {contributor.image_url && (
                  <img
                    src={contributor.image_url}
                    alt={contributor.full_name}
                    className="h-10 w-10 rounded-full"
                  />
                )}
                <div className="text-sm font-medium text-gray-500 truncate">
                  {contributor.full_name}
                </div>
              </div>

              <div className="mt-1 text-3xl font-semibold text-gray-900">
                {contributor.post_count} Posts
              </div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                {contributor.comment_count} Comments
              </div>
              <div className="flex items-center mt-1">
                <div className="text-sm font-medium text-green-600">
                  {contributor.upvote_count} Upvotes
                </div>
                <div className="ml-4 text-sm font-medium text-red-600">
                  {contributor.downvote_count} Downvotes
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopContributors;
