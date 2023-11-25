// EditPost.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { Transition } from "@headlessui/react";
import { FaEdit } from "react-icons/fa";

const EditPost = () => {
  const [post, setPost] = useState({
    post_title: "",
    post_desc: "",
    tag_id: "",
    image_url: "",
  });

  const createTagRef = useRef(null);
  const fileInputRef = useRef(null);

  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [showCreateTag, setShowCreateTag] = useState(false);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/${postId}`);
        if (response.data && response.data[0]) {
          setPost(response.data[0]);
        } else {
          console.error("Post data not found");
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get(`${API_URL}/tags`);
        console.log("im in the editpost and the tags have been received");
        console.log("the tags are " + response);
        setTags(response.data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
    fetchPostDetails();
  }, [postId]);

  const handleTagChange = (e) => {
    setPost({ ...post, tag_id: e.target.value });
  };

  const handleNewTagChange = (e) => {
    setNewTagName(e.target.value);
  };

  const handleCreateTag = async () => {
    if (
      tags.some(
        (tag) => tag.tag_name.toLowerCase() === newTagName.toLowerCase()
      )
    ) {
      alert("This tag already exists.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/tags`, {
        tagName: newTagName,
      });
      const newTag = response.data;
      setTags([...tags, newTag]);
      setPost({ ...post, tag_id: newTag.id });
      setNewTagName("");
    } catch (error) {
      console.error("Error creating new tag:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPost({ ...post, image_url: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(post).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      console.log("im in the try postID is " + postId);
      console.log("the data is ", formData);
      const response = await axios({
        method: "put",
        url: `${API_URL}/posts/${postId}`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        navigate(`/posts/${postId}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const toggleCreateTag = () => {
    setShowCreateTag(!showCreateTag);
  };

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto p-5">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <div className="px-8 pt-6 pb-8 mb-4 bg-white">
            <div className="mb-6">
              <label
                htmlFor="image"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Post Image
              </label>
              <div className="relative">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="rounded-lg border-2 border-gray-300"
                  />
                )}
                <button
                  type="button"
                  onClick={handleImageUploadClick}
                  className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 ease-in-out"
                  aria-label="Edit image"
                >
                  <FaEdit size={20} />
                </button>
              </div>
              <input
                type="file"
                id="image"
                name="image"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* start of title */}
            <div className="mb-6">
              <label
                htmlFor="post_title"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Post Title
              </label>
              <input
                type="text"
                id="post_title"
                name="post_title"
                value={post.post_title}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            {/* end of title */}

            {/* start of tags */}
            <div className="mb-6">
              <label
                htmlFor="tag_id"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Tags
              </label>
              <div className="relative">
                <select
                  id="tag_id"
                  name="tag_id"
                  value={post.tag_id}
                  onChange={handleTagChange}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a tag</option>
                  {tags.map((tag) => (
                    <option key={tag.tag_id} value={tag.tag_id}>
                      {tag.tag_name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-700"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <p className="text-gray-700">Can't find your tag?</p>
                <button
                  type="button"
                  onClick={toggleCreateTag}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition duration-150 ease-in-out"
                >
                  Click here to create one
                  <svg
                    className="ml-1 w-4 h-4 inline"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
            </div>
            <Transition
              show={showCreateTag}
              enter="transition ease-out duration-300"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-200"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="mb-6">
                <label
                  htmlFor="newTag"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Create New Tag
                </label>
                <input
                  type="text"
                  id="newTag"
                  value={newTagName}
                  onChange={handleNewTagChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="New tag name"
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create
                </button>
              </div>
            </Transition>
            {/* end of tags */}

            {/* start of post description */}
            <div className="mb-6">
              <label
                htmlFor="post_desc"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Post Description
              </label>
              <textarea
                id="post_desc"
                name="post_desc"
                value={post.post_desc}
                onChange={handleInputChange}
                rows="4"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                required
              />
            </div>
            {/* end of post description */}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Update Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
