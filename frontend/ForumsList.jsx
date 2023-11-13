import React, { useState, useEffect } from "react";
import axios from "axios";
import ForumsCard from "./ForumsCard";

const ForumsList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Function to fetch posts
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8081/posts");
        console.log(
          "the response data in forumslist is " + response.data[1].tag_name
        );
        setPosts(response.data); // Set posts in state
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Render the list of forum cards
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        marginRight: "auto",
        marginLeft: "auto",
        padding: "15px",
      }}
    >
      {posts.map((post) => (
        <ForumsCard
          key={post.post_id} // Adjusted to match JSON data key
          post_title={post.post_title}
          tag_name={post.tag_name} // Now passing tag_name
          post_desc={post.post_desc}
          username={post.username} // Now passing username
          poster_id={post.poster_id}
          time_created={post.time_created}
          comment_count={post.comment_count}
          post_upvotes={post.post_upvotes}
          post_downvotes={post.post_downvotes}
          image_url={post.image_url} // New prop for the image
          user_image_url={post.user_image_url} // Now passing user_image_url
        />
      ))}
    </div>
  );
};

export default ForumsList;
