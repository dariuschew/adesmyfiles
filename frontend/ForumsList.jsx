import React, { useState, useEffect } from "react";
import axios from "axios";
import ForumsCard from "./ForumsCard";
import ForumsSearchBar from "./ForumsSearchBar";
import FilterComponent from "./FilterComponent";
import { API_URL } from "../config";

const ForumsList = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchTypeChange = (newSearchType) => {
    setSearchType(newSearchType);
  };

  const handleSearchSubmit = async () => {
    if (!searchTerm.trim()) return;

    const endpoint =
      searchType === "title"
        ? `/posts/title/${encodeURIComponent(searchTerm)}`
        : `/posts/tag/${encodeURIComponent(searchTerm)}`;

    try {
      const response = await axios.get(`http://localhost:8081${endpoint}`);
      setPosts(response.data);
    } catch (error) {
      console.error(`Error searching posts by ${searchType}:`, error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchAllPosts();
  };

  const handleVoteChange = (postId, newUpvotes, newDownvotes) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.post_id === postId
          ? { ...post, post_upvotes: newUpvotes, post_downvotes: newDownvotes }
          : post
      )
    );
  };

  const handleFilterChange = async (sortBy) => {
    try {
      const endpoint = searchTerm.trim()
        ? `/posts/search-and-sort?searchTerm=${encodeURIComponent(
            searchTerm
          )}&sortBy=${sortBy}`
        : `/posts/sorted/${sortBy}`;

      const response = await axios.get(`http://localhost:8081${endpoint}`);
      setPosts(response.data);
    } catch (error) {
      console.error(`Error fetching posts:`, error);
    }
  };

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
      <div className=" px-4">
        <ForumsSearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          onSearchTypeChange={handleSearchTypeChange}
          onSearchSubmit={handleSearchSubmit}
          onClearSearch={handleClearSearch}
        />
      </div>

      <FilterComponent onFilterChange={handleFilterChange} />

      {posts.length > 0 ? (
        posts.map((post) => (
          <ForumsCard
            key={post.post_id}
            postId={post.post_id}
            post_title={post.post_title}
            tag_name={post.tag_name}
            post_desc={post.post_desc}
            username={post.username}
            poster_id={post.poster_id}
            time_created={post.time_created}
            comment_count={post.comment_count}
            post_upvotes={post.post_upvotes}
            post_downvotes={post.post_downvotes}
            image_url={post.image_url}
            user_image_url={post.user_image_url}
            onVoteChange={handleVoteChange}
          />
        ))
      ) : (
        <div className="text-center py-10">
          <p>No posts found. Try a different search term or filter.</p>
        </div>
      )}
    </div>
  );
};

export default ForumsList;
