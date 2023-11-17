import React, { useState, useRef } from "react";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown, FaPen, FaTrash } from "react-icons/fa";

const PostDetailsCard = ({
  post,
  currentUserId,
  onVoteChange,
  onDeletePost,
}) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleUpvote = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/posts/${post.post_id}/upvote`
      );
      if (response.status === 200) {
        onVoteChange(post.post_id, post.post_upvotes + 1, post.post_downvotes);
      }
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  const handleDownvote = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/posts/${post.post_id}/downvote`
      );
      if (response.status === 200) {
        onVoteChange(post.post_id, post.post_upvotes, post.post_downvotes + 1);
      }
    } catch (error) {
      console.error("Error downvoting post:", error);
    }
  };

  // Function placeholders for handling edit and delete actions
  const handleEdit = () => {
    console.log("Edit post");
  };

  const handleDelete = () => {
    onDeletePost();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden text-gray-800">
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
            <p className="text-sm font-medium text-gray-900">{post.username}</p>
            <p className="text-xs text-gray-500">
              {formatDate(post.time_created)}
            </p>
          </div>
          {/* Edit and Delete icons */}
          {post.user_id === currentUserId && (
            <div className="flex justify-end space-x-2 p-4">
              <button onClick={handleEdit} aria-label="Edit post">
                <FaPen className="text-gray-600 hover:text-gray-800" />
              </button>
              <button onClick={handleDelete} aria-label="Delete post">
                <FaTrash className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>
          )}
        </div>
      </div>

      <span className="ml-5 bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-3 py-2 rounded-full">
        {post.tag_name}
      </span>

      {/* Voting section - aligned with the post description */}
      <div className="flex flex-row items-center space-x-2 pt-5">
        <p className="px-4 md:px-6 mt-2 text-sm md:text-base text-gray-600">
          {post.post_desc}
        </p>

        <div className="flex flex-row p-5">
          {" "}
          <button
            className="vote-button p-1"
            onClick={handleUpvote}
            aria-label="Upvote"
          >
            <FaThumbsUp className="text-gray-600 hover:text-gray-800" />
          </button>
          <div className="vote-count text-gray-600 font-semibold pl-2 pr-2 pt-1">
            {post.post_upvotes - post.post_downvotes}
          </div>
          <button
            className="vote-button p-1"
            onClick={handleDownvote}
            aria-label="Downvote"
          >
            <FaThumbsDown className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>
      </div>

      {/* <div>
        <button className="vote-button" onClick={handleUpvote}>
          ▲
        </button>
        <div className="vote-count">
          {post.post_upvotes - post.post_downvotes}
        </div>
        <button className="vote-button" onClick={handleDownvote}>
          ▼
        </button>
      </div>   */}
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
