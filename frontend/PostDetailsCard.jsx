import React from "react";
import { FaThumbsUp, FaComment } from "react-icons/fa";

const PostDetailsCard = ({ post }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 hover:text-gray-600 transition duration-300">
          {post.post_title}
        </h2>
        <div className="flex items-center space-x-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={post.user_image_url}
            alt={post.username}
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {post.username}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(post.time_created)}
            </p>
          </div>
        </div>
      </div>
      <span className="block px-4 md:px-6 text-xs font-semibold text-blue-600 uppercase tracking-wide">
        {post.tag_name}
      </span>
      <p className="px-4 md:px-6 mt-2 text-sm md:text-base text-gray-600">
        {post.post_desc}
      </p>
      <div className="px-4 md:px-6 pb-4 md:pb-6 mt-5">
        <img
          className="w-full h-auto object-contain rounded-lg"
          src={post.image_url}
          alt={post.post_title}
        />
      </div>
    </div>
  );
};

export default PostDetailsCard;
