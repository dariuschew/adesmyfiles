// PostDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostDetailsCard from "../components/PostDetailsCard";

const PostDetails = () => {
  const [post, setPost] = useState(null);
  const { postId } = useParams();

  useEffect(() => {
    const fetchPostDetails = async () => {
      console.log(`Attempting to fetch details for post with ID: ${postId}`);
      try {
        const response = await axios.get(`http://localhost:8081/posts/${postId}`);
        console.log('Response data:', response.data);
  
        // Ensure the received data is an array and not empty
        if (!Array.isArray(response.data) || response.data.length === 0) {
          throw new Error("Invalid post data structure received from the API");
        }
  
        setPost(response.data[0]); // Set the first post object from the response array
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };
  
    if (postId) {
      fetchPostDetails();
    } else {
      console.error("No postId found in URL parameters.");
    }
  }, [postId]);
  

  if (!post) {
    console.log(
      "Post data is not yet available. The component is displaying a loading state."
    );
    return <div>Loading...</div>;
  }

  console.log("Post data is available, rendering PostDetailsCard component.");
  return (
    <div className="mx-auto mt-5">
      <PostDetailsCard post={post} />
    </div>
  );
};

export default PostDetails;
