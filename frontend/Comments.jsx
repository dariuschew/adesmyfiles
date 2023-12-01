////state management
import React, { useState, useEffect } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaPen,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../config";

const Comment = ({
  comment,
  onUpvote,
  onDownvote,
  currentUserId,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.comment);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/comments/${comment.comment_id}/vote-status`,
          { params: { userId: currentUserId } }
        );
        if (response.data.vote_type === "upvote") {
          setUserVote("upvote");
        } else if (response.data.vote_type === "downvote") {
          setUserVote("downvote");
        }
      } catch (error) {
        console.error("Error fetching vote status:", error);
      }
    };

    fetchVoteStatus();
  }, [comment.comment_id, currentUserId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onEdit(comment.comment_id, editedComment);
    setIsEditing(false);
  };

  // Format the date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(date));
  };

  const handleUpvote = () => {
    onUpvote(comment.comment_id);
    setUserVote(userVote !== "upvote" ? "upvote" : null);
  };

  const handleDownvote = () => {
    onDownvote(comment.comment_id);
    setUserVote(userVote !== "downvote" ? "downvote" : null);
  };

  return (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-200">
      <img
        src={comment.image_url}
        alt={comment.username}
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{comment.username}</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleUpvote}
              className={`text-gray-500 ${
                userVote === "upvote" ? "text-blue-700" : ""
              } `}
            >
              <FaArrowUp />
            </button>
            <span>{comment.comment_upvotes - comment.comment_downvotes}</span>

            <button
              onClick={handleDownvote}
              className={`text-gray-500 ${
                userVote === "downvote" ? "text-red-600" : ""
              } `}
            >
              <FaArrowDown />
            </button>
          </div>
        </div>
        <div className="pr-4">
          {isEditing ? (
            <input
              type="text"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="flex-1 border rounded p-2 text-gray-700"
            />
          ) : (
            <p className="text-gray-600 text-sm mt-1">{comment.comment}</p>
          )}
        </div>
        <time className="text-xs text-gray-400">
          {formatDate(comment.time_commented)}
        </time>
      </div>

      {comment.user_id === currentUserId && (
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <button onClick={handleSaveClick} aria-label="Save comment">
              <FaCheck className="text-green-600 hover:text-green-800" />
            </button>
          ) : (
            <>
              <button onClick={handleEditClick} aria-label="Edit comment">
                <FaPen className="text-gray-600 hover:text-gray-800" />
              </button>
              <button
                onClick={() => onDelete(comment.comment_id)}
                aria-label="Delete comment"
              >
                <FaTrash className="text-gray-600 hover:text-gray-800" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
