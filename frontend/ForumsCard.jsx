import React from "react";
import axios from "axios";
import "../css/ForumsCard.css";
import { Link } from "react-router-dom";

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
}) => {
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

  const handleUpvote = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/posts/${postId}/upvote`
      );
      // Check if the response is successful and contains the updated count
      if (response.status === 200) {
        // Call the onVoteChange with new upvote count
        onVoteChange(postId, post_upvotes + 1, post_downvotes);
      }
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  const handleDownvote = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/posts/${postId}/downvote`
      );
      // Check if the response is successful and contains the updated count
      if (response.status === 200) {
        // Call the onVoteChange with new downvote count
        onVoteChange(postId, post_upvotes, post_downvotes + 1);
      }
    } catch (error) {
      console.error("Error downvoting post:", error);
    }
  };

  return (
    <div className="post">
      <div className="post-vote">
        <button className="vote-button" onClick={handleUpvote}>
          ▲
        </button>
        <div className="vote-count">{post_upvotes - post_downvotes}</div>
        <button className="vote-button" onClick={handleDownvote}>
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
          {/* New wrapper for text */}
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
