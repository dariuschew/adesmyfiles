//concurrent for handleDeletedComment, handleNewCommentSection, handleDeletePost
// PostDetails.jsx
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostDetailsCard from "../components/PostDetailsCard";
import Comment from "../components/Comments";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const PostDetails = () => {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const newCommentRef = useRef(null);
  const [commentCount, setCommentCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      console.log(`Attempting to fetch details for post with ID: ${postId}`);
      try {
        const response = await axios.get(`${API_URL}/posts/${postId}`);
        console.log(
          "Response data from post details useeffect is:",
          response.data
        );

        // Ensure the received data is an array and not empty
        if (!Array.isArray(response.data) || response.data.length === 0) {
          throw new Error("Invalid post data structure received from the API");
        }

        setPost(response.data[0]); // Set the first post object from the response array
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_URL}/comments/post/${postId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const fetchCommentCount = async () => {
      try {
        const response = await axios.get(`${API_URL}/comments/count/${postId}`);
        setCommentCount(response.data.commentCount);
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };

    if (postId) {
      fetchPostDetails();
      fetchComments();
      fetchCommentCount();
    } else {
      console.error("No postId found in URL parameters.");
    }
  }, [postId, commentCount]);

  if (!post) {
    console.log(
      "Post data is not yet available. The component is displaying a loading state."
    );
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  const handleVoteChange = (postId, newUpvotes, newDownvotes) => {
    setPost((prevPost) =>
      prevPost.post_id === postId
        ? {
            ...prevPost,
            post_upvotes: newUpvotes,
            post_downvotes: newDownvotes,
          }
        : prevPost
    );
  };

  const handleCommentUpvote = async (commentId) => {
    try {
      const response = await axios.put(
        `${API_URL}/comments/upvote/${commentId}`
      );
      if (response.status === 200) {
        // Update the comments state with the new upvote count
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.comment_id === commentId
              ? { ...comment, comment_upvotes: comment.comment_upvotes + 1 }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error upvoting comment:", error);
    }
  };

  const handleCommentDownvote = async (commentId) => {
    try {
      const response = await axios.put(
        `${API_URL}/comments/downvote/${commentId}`
      );
      if (response.status === 200) {
        // Update the comments state with the new downvote count
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.comment_id === commentId
              ? { ...comment, comment_downvotes: comment.comment_downvotes + 1 }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error downvoting comment:", error);
    }
  };

  const fetchComments = async (sortBy = "") => {
    try {
      const url = sortBy
        ? `${API_URL}/comments/sorted/${sortBy}/${postId}`
        : `${API_URL}/comments/post/${postId}`;
      const response = await axios.get(url);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSortChange = (event) => {
    fetchComments(event.target.value);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const deleteCommentPromise = axios.delete(
        `${API_URL}/comments/${commentId}`
      );

      const decrementCommentCountPromise = axios.post(
        `${API_URL}/posts/${postId}/decrement-comment-count`
      );

      await Promise.all([deleteCommentPromise, decrementCommentCountPromise]);

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.comment_id !== commentId)
      );
    } catch (error) {
      console.error(
        "Error deleting comment or updating post's comment count:",
        error
      );
    }
    setCommentCount((prevCount) => prevCount - 1);
  };

  const handleEditComment = async (commentId, updatedComment) => {
    try {
      const response = await axios.put(`${API_URL}/comments/${commentId}`, {
        comment: updatedComment,
      });
      if (response.status === 200) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.comment_id === commentId
              ? { ...comment, comment: updatedComment }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const scrollToNewComment = () => {
    newCommentRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleNewCommentSubmit = async () => {
    var currentUserId = 1;

    if (!newComment.trim()) {
      console.log("Cannot submit an empty comment.");
      return;
    }

    try {
      const commentData = {
        post_id: postId,
        user_id: currentUserId,
        comment: newComment,
      };

      const createCommentPromise = axios.post(
        `${API_URL}/comments`,
        commentData
      );

      const incrementCommentCountPromise = axios.post(
        `${API_URL}/posts/${postId}/increment-comment-count`
      );

      await Promise.all([createCommentPromise, incrementCommentCountPromise]);

      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error(
        "Error submitting new comment or updating post's comment count:",
        error
      );
    }
    setCommentCount((prevCount) => prevCount + 1);
  };

  const handleDeletePost = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post and all its comments?"
      )
    ) {
      return;
    }

    const deleteCommentsPromises = comments.map((comment) =>
      axios.delete(`${API_URL}/comments/${comment.comment_id}`)
    );

    const deletePostPromise = axios.delete(`${API_URL}/posts/${postId}`);

    try {
      await Promise.all([...deleteCommentsPromises, deletePostPromise]);

      console.log("Post and comments deleted successfully");
      navigate("/forums");
    } catch (error) {
      console.error("Error deleting post and comments:", error);
    }
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div className="mx-auto p-5">
        <PostDetailsCard
          post={post}
          currentUserId={1}
          onVoteChange={handleVoteChange}
          onDeletePost={handleDeletePost}
        />

        <div className="mt-10 max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden text-gray-800">
          <div className="flex justify-between items-center mt-4 bg-white p-4 shadow rounded-lg">
            {/* Display the comment count */}
            <div className="p-4 bg-white shadow rounded-lg mr-3">
              <h3 className="text-lg font-semibold">{commentCount} Comments</h3>
            </div>
            <div className="flex-grow pr-4">
              {" "}
              <select
                onChange={handleSortChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
              >
                <option value="">Sort Comments</option>
                <option value="upvotes">By Upvotes</option>
                <option value="recent">By Recent</option>
              </select>
            </div>

            <button
              onClick={scrollToNewComment}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
            >
              Write a Comment
            </button>
          </div>

          <div className="mt-3">
            {comments.map((comment) => (
              <Comment
                key={comment.comment_id}
                comment={comment}
                onUpvote={handleCommentUpvote}
                onDownvote={handleCommentDownvote}
                currentUserId={1}
                onDelete={handleDeleteComment}
                onEdit={handleEditComment}
              />
            ))}
          </div>

          {/* New Comment Input */}
          <div
            ref={newCommentRef}
            className="mt-10 mb-4 p-4 bg-white shadow rounded-lg"
          >
            <textarea
              value={newComment}
              onChange={handleNewCommentChange}
              className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your comment here..."
              rows="4"
            />
            <div className="text-right mt-2">
              {" "}
              <button
                onClick={handleNewCommentSubmit}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
              >
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
