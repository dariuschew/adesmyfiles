//state management
import React, { useState, useEffect } from "react";
import axios from "axios";
import ForumsCard from "./ForumsCard";
import ForumsSearchBar from "./ForumsSearchBar";
import FilterComponent from "./FilterComponent";
import TopContributors from "./TopContributors";
import { API_URL } from "../config";

const ForumsList = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [totalPosts, setTotalPosts] = useState(0);
  const [activeFilter, setActiveFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Posts updated:", posts);
  }, [posts]);

  useEffect(() => {
    console.log(`Active Filter changed: ${activeFilter}`);
  }, [activeFilter]);

  const fetchAllPosts = async () => {
    setPosts([]);
    setIsLoading(true);
    console.log("fetchAllPosts started");

    let endpoint = searchTerm.trim() ? "/posts/search-and-sort" : "/posts";
    console.log(`Endpoint determined: ${endpoint}`);

    console.log(`Active Filter before setting params: ${activeFilter}`);

    const params = {
      page: currentPage,
      limit: postsPerPage,
      sortBy: activeFilter,
    };
    console.log("Initial params set", params);
    console.log("Params after adjusting for searchTerm", params);

    console.log(
      `Fetching posts with searchTerm: ${searchTerm}, searchType: ${searchType}, activeFilter: ${activeFilter}, currentPage: ${currentPage}`
    );

    if (searchTerm.trim()) {
      console.log("Search term is present. Adjusting params for search.");
      params.searchTerm = searchTerm;
      params.sortBy = activeFilter;
      console.log("Updated params for searchTerm", params);

      if (searchType === "tags") {
        console.log("Search type is tags");
        params.searchType = "tag";
      } else if (searchType === "title") {
        console.log("Search type is title");
        params.searchType = "title";
      }
      console.log("Final params after searchType adjustment", params);
    } else if (activeFilter) {
      console.log("Active filter is present without searchTerm", activeFilter);
      params.sortBy = activeFilter;
    }

    try {
      console.log(
        `Making API call to ${API_URL}${endpoint} with params`,
        params
      );
      console.log(`Parameters used for API call:`, params);
      const response = await axios.get(`${API_URL}${endpoint}`, { params });
      console.log("API call successful. Response received:", response);

      const responseData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      console.log("Processed response data:", responseData);

      if (responseData.total != null) {
        console.log(`Total posts: ${responseData.total}`);
        setTotalPosts(parseInt(responseData.total));
      }

      if (Array.isArray(responseData.posts)) {
        console.log(`Number of posts received: ${responseData.posts.length}`);
        setPosts(responseData.posts);
      } else {
        console.log(
          "No posts array in response. Setting posts to empty array."
        );
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }

    console.log("fetchAllPosts completed");
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllPosts();
    console.log(posts);
  }, [currentPage, postsPerPage, activeFilter, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchTypeChange = (newSearchType) => {
    setSearchType(newSearchType);
  };

  const handleSearchSubmit = async () => {
    if (!searchTerm.trim()) return;
    setCurrentPage(1);
    fetchAllPosts();
  };

  const handleClearSearch = () => {
    console.log("Clearing search");
    setSearchType("");
    console.log(searchType);
    setActiveFilter("");
    setSearchTerm("");
    setCurrentPage(1);
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

  const handleFilterChange = (filter) => {
    console.log("the filter is " + filter);
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const safeCalculateVotes = (upvotes, downvotes) => {
    const up = Number(upvotes);
    const down = Number(downvotes);
    return !isNaN(up) && !isNaN(down) ? up - down : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row">
        {/* Main content */}
        <div className="w-full md:pr-4 lg:pr-6 md:w-2/3">
          <div className=" px-4">
            <ForumsSearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              onSearchTypeChange={handleSearchTypeChange}
              onSearchSubmit={handleSearchSubmit}
              onClearSearch={handleClearSearch}
            />
          </div>

          {/* Filter buttons */}
          <div className="flex space-x-2 my-4">
            <button
              onClick={() => handleFilterChange("recent")}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                activeFilter === "recent"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => handleFilterChange("upvotes")}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                activeFilter === "upvotes"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              By Upvotes
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <p>Loading...</p>
            </div>
          ) : (
            <div>
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
                    safeCalculateVotes={safeCalculateVotes}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <p>No posts found. Try a different search term or filter.</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination controls */}
          <div className="flex justify-center items-center space-x-2 my-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={currentPage === page}
                className={`${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500 hover:bg-blue-100"
                } font-semibold py-2 px-4 border border-blue-500 rounded focus:outline-none focus:shadow-outline`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/3 md:pl-4 lg:pl-6 mt-6 md:mt-0">
          <TopContributors />
        </div>
      </div>
    </div>
  );
};

export default ForumsList;
