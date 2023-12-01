import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/ForumsCard.css";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

const ForumsCard = ({
  postId,
  post_title,
  tags,
  post_desc,
  tag_name,
  time_created,
  comment_count,
  post_upvotes,
  post_downvotes,
  image_url,
  username,
  user_image_url,
  onVoteChange,
  safeCalculateVotes,
}) => {
  const [userVote, setUserVote] = useState(null);
  console.log(
    `Initial render of post ${postId} with upvotes: ${post_upvotes}, downvotes: ${post_downvotes}`
  );

  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        const userId = 1;
        const response = await axios.get(
          `${API_URL}/posts/${postId}/vote-status`,
          { params: { userId } }
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
  }, [postId]);

  // Function to format the date/time
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if tags is not undefined and is an array
  const tagElements = Array.isArray(tags)
    ? tags.map((tag) => (
        <span key={tag} className="post-tag">
          {tag}
        </span>
      ))
    : null;

  // [SEQUENTIAL]
  const handleVote = async (voteType) => {
    console.log(`Attempting to upvote post with ID: ${postId}`);

    try {
      const voteResponse = await axios.post(`${API_URL}/posts/${postId}/vote`, {
        userId: 1,
        voteType: voteType,
      });
      console.log(`Response received for upvote:`, voteResponse);

      if (
        voteResponse.status === 201 &&
        !voteResponse.data.result.alreadyVoted
      ) {
        console.log("Upvote successful, updating state...");

        const voteCountEndpoint = voteType === "upvote" ? "upvote" : "downvote";
        const voteCountResponse = await axios.post(
          `${API_URL}/posts/${postId}/${voteCountEndpoint}`
        );

        if (voteCountResponse.status === 200) {
          const newUpvotes =
            voteType === "upvote" ? post_upvotes + 1 : post_upvotes;
          const newDownvotes =
            voteType === "downvote" ? post_downvotes + 1 : post_downvotes;

          onVoteChange(postId, newUpvotes, newDownvotes);
          setUserVote(voteType);
        }
        console.log("State updated with new upvotes count");
      } else if (voteResponse.data.alreadyVoted) {
        console.log("You have already voted this way.");
      }
    } catch (error) {
      console.error(`Error when attempting to ${voteType} vote post:`, error);
    }
  };

  // const handleUpvote = async () => {
  //   try {
  //     const response = await axios.post(`${API_URL}/posts/${postId}/upvote`);
  //     // Check if the response is successful and contains the updated count
  //     if (response.status === 200) {
  //       // Call the onVoteChange with new upvote count
  //       onVoteChange(postId, post_upvotes + 1, post_downvotes);
  //     }
  //   } catch (error) {
  //     console.error("Error upvoting post:", error);
  //   }
  // };

  // const handleDownvote = async () => {
  //   try {
  //     const response = await axios.post(`${API_URL}/posts/${postId}/downvote`);
  //     // Check if the response is successful and contains the updated count
  //     if (response.status === 200) {
  //       // Call the onVoteChange with new downvote count
  //       onVoteChange(postId, post_upvotes, post_downvotes + 1);
  //     }
  //   } catch (error) {
  //     console.error("Error downvoting post:", error);
  //   }
  // };

  console.log(
    `Rendering post ${postId} with upvotes: ${post_upvotes}, downvotes: ${post_downvotes}`
  );
  console.log(
    `Vote difference for post ${postId}:`,
    safeCalculateVotes(post_upvotes, post_downvotes)
  );

  return (
    <div className="post">
      <div className="post-vote">
        <button
          className={`vote-button ${
            userVote === "upvote" ? "text-blue-600" : "text-gray-400"
          } hover:text-blue-800`}
          onClick={() => {
            console.log(post_upvotes, post_downvotes);
            handleVote("upvote");
          }}
        >
          ▲
        </button>
        <div className="vote-count">
          {safeCalculateVotes(post_upvotes, post_downvotes)}
        </div>
        <button
          className={`vote-button ${
            userVote === "downvote" ? "text-red-600" : "text-gray-400"
          } hover:text-red-800`}
          onClick={() => {
            console.log(post_upvotes, post_downvotes);
            handleVote("downvote");
          }}
        >
          ▼
        </button>
      </div>
      <div className="post-content">
        <div style={{ marginRight: "40px" }}>
          {" "}
          <img src={image_url} alt={post_title} className="post-image" />
        </div>
        <div className="text-content">
          {" "}
          <Link to={`/posts/${postId}`}>
            <h3 className="post-title" style={{ fontWeight: "bold" }}>
              {post_title}
            </h3>
          </Link>
          {tag_name && (
            <div className="post-tag" style={{ textAlign: "center" }}>
              {tag_name}
            </div>
          )}
          <div className="post-description">{post_desc}</div>
          <div className="post-footer">
            {user_image_url && (
              <img src={user_image_url} alt={username} className="user-image" />
            )}
            {username && <span className="username">{username}</span>}
            <span className="post-timestamp">{formatDate(time_created)}</span>
            <span className="post-comments">{comment_count} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumsCard;
