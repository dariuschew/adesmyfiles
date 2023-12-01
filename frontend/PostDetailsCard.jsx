//state management
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown, FaPen, FaTrash } from "react-icons/fa";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

const PostDetailsCard = ({
  post,
  currentUserId,
  onVoteChange,
  onDeletePost,
}) => {
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/posts/${post.post_id}/vote-status`,
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
  }, [post.post_id, currentUserId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // const handleUpvote = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${API_URL}/posts/${post.post_id}/upvote`
  //     );
  //     if (response.status === 200) {
  //       onVoteChange(post.post_id, post.post_upvotes + 1, post.post_downvotes);
  //     }
  //   } catch (error) {
  //     console.error("Error upvoting post:", error);
  //   }
  // };

  // const handleDownvote = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${API_URL}/posts/${post.post_id}/downvote`
  //     );
  //     if (response.status === 200) {
  //       onVoteChange(post.post_id, post.post_upvotes, post.post_downvotes + 1);
  //     }
  //   } catch (error) {
  //     console.error("Error downvoting post:", error);
  //   }
  // };

  const handleVote = async (voteType) => {
    try {
      const voteResponse = await axios.post(
        `${API_URL}/posts/${post.post_id}/vote`,
        {
          userId: currentUserId,
          voteType: voteType,
        }
      );

      if (
        voteResponse.status === 201 &&
        !voteResponse.data.result.alreadyVoted
      ) {
        const voteCountEndpoint = voteType === "upvote" ? "upvote" : "downvote";
        const voteCountResponse = await axios.post(
          `${API_URL}/posts/${post.post_id}/${voteCountEndpoint}`
        );

        if (voteCountResponse.status === 200) {
          const newUpvotes =
            voteType === "upvote" ? post.post_upvotes + 1 : post.post_upvotes;
          const newDownvotes =
            voteType === "downvote"
              ? post.post_downvotes + 1
              : post.post_downvotes;

          onVoteChange(post.post_id, newUpvotes, newDownvotes);
          setUserVote(voteType);
        }
      } else if (voteResponse.data.result.alreadyVoted) {
        console.log("You have already voted this way.");
      }
    } catch (error) {
      console.error(`Error when attempting to ${voteType} vote post:`, error);
    }
  };

  const handleUpvote = () => handleVote("upvote");
  const handleDownvote = () => handleVote("downvote");

  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/editpost/${post.post_id}`);
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
            className={`vote-button p-1 ${
              userVote === "upvote" ? "text-blue-600" : "text-gray-600"
            } hover:text-gray-800`}
            onClick={handleUpvote}
            aria-label="Upvote"
          >
            <FaThumbsUp />
          </button>
          <div className="vote-count text-gray-600 font-semibold pl-2 pr-2 pt-1">
            {post.post_upvotes - post.post_downvotes}
          </div>
          <button
            className={`vote-button p-1 ${
              userVote === "downvote" ? "text-red-600" : "text-gray-600"
            } hover:text-gray-800`}
            onClick={handleDownvote}
            aria-label="Downvote"
          >
            <FaThumbsDown />
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
