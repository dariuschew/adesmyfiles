//state management
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function CreatePostModal({ closeModal, userId }) {
  const [postData, setPostData] = useState({
    post_title: "",
    post_desc: "",
    image_id: null,
    comment_count: 1,
    tag_id: null,
    poster_id: userId, 
  });

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [validationMessages, setValidationMessages] = useState({
    post_title: "",
    post_desc: "",
    image: "",
    tag_id: "",
  });

  useEffect(() => {
    axios
      .get(`${API_URL}/tags`)
      .then((response) => {
        setTags(response.data);
        console.log("Tags fetched:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    console.log("postData updated:", postData);
  }, [postData]);

  useEffect(() => {
    console.log("New Tag State Updated:", newTag);
  }, [newTag]);

  const validateField = (name, value) => {
    if (!value) {
      setValidationMessages((prev) => ({
        ...prev,
        [name]: `The ${name.replace("_", " ")} is required.`,
      }));
      return false;
    } else {
      setValidationMessages((prev) => ({
        ...prev,
        [name]: "",
      }));
      return true;
    }
  };

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    setPostData((prev) => ({ ...prev, [fieldName]: value }));
    validateField(fieldName, value);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setImagePreview(fileReader.result);
      };
      fileReader.readAsDataURL(e.target.files[0]);

      setPostData({ ...postData, image: e.target.files[0] });
      setValidationMessages((prev) => ({ ...prev, image: "" }));
      console.log("Image selected:", e.target.files[0]);
    } else {
      setValidationMessages((prev) => ({
        ...prev,
        image: "Please select an image.",
      }));
    }
  };

  const validateForm = () => {
    const titleValid = validateField("post_title", postData.post_title);
    const descValid = validateField("post_desc", postData.post_desc);
    const tagValid = validateField("tag_id", postData.tag_id);
    const imageValid = postData.image != null || validateField("image", "");

    return titleValid && descValid && imageValid && tagValid;
  };

  const handleCreateTag = async () => {
    try {
      const response = await axios.post(`${API_URL}/tags`, {
        tagName: newTag,
      });
      setTags([...tags, response.data]);
      setPostData({ ...postData, tag_id: response.data.tag_id });
      setNewTag("");
      console.log("New tag created:", response.data);
    } catch (error) {
      console.error("Error creating new tag:", error);
    }
  };

  const handleCreatePost = async () => {
    if (!validateForm()) {
      console.error("Validation failed");
      return;
    }

    if (postData.image) {
      try {
        const imageData = new FormData();
        imageData.append("image", postData.image);
        imageData.append("folderPath", "ADES/Community/Group Icon");

        const imageUploadResponse = await axios.post(
          `${API_URL}/upload`,
          imageData
        );
        console.log("Image Upload Response:", imageUploadResponse.data);

        const image_id = imageUploadResponse.data;

        const updatedPostData = {
          ...postData,
          image_id: image_id,
        };

        delete updatedPostData.image;

        const postResponse = await axios.post(
          `${API_URL}/posts`,
          updatedPostData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Post Creation Response:", postResponse.data);
        closeModal();
      } catch (error) {
        console.error("Error during the post creation:", error);
      }
    } else {
      console.error("No image to upload");
    }
  };

  const checkTagExistence = (tagName) => {
    return tags.find(
      (tag) => tag.tag_name.toLowerCase() === tagName.toLowerCase()
    );
  };

  const handleTagInput = (e) => {
    const inputTag = e.target.value;
    setNewTag(inputTag);
    console.log("Input Tag:", inputTag);

    const existingTag = checkTagExistence(inputTag);
    if (existingTag) {
      setPostData({ ...postData, tag_id: existingTag.tag_id });
    } else {
      setPostData({ ...postData, tag_id: null });
    }
    console.log("Updated Post Data:", postData);
  };

  const [blurTimeoutId, setBlurTimeoutId] = useState(null);

  const handleInputBlur = () => {
    const timeoutId = setTimeout(() => {
      setIsInputFocused(false);
    }, 100); // delay of 100ms
    setBlurTimeoutId(timeoutId);
  };

  const handleTagSelection = (tag) => {
    clearTimeout(blurTimeoutId);
    setPostData({ ...postData, tag_id: tag.tag_id });
    setNewTag(tag.tag_name);
    console.log("Selected Tag:", tag.tag_name);
    setIsInputFocused(false);
  };

  return (
    <div className="fixed w-full flex flex-col justify-center z-20 inset-0">
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-7"
        onClick={closeModal}
      ></div>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block pl-2 font-bold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">Create a Post</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-6 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <div className="text-center">
                    <span className="block w-20 h-20 mb-2 border-slate-500 border-2 border-dashed rounded-full m-auto flex justify-center items-center overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Uploaded"
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <svg
                          className="w-12 h-12 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 10l4.55-3c.67-.44 1.45.34 1.45 1.15V16c0 .81-.78 1.58-1.45 1.15L15 14v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.59c-.73-.29-1.5-1.21-1.5-2.41v-1c0-1.2.77-2.12 1.5-2.41V10a2 2 0 012-2h6a2 2 0 012 2v2z"
                          />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </span>
                    <label
                      htmlFor="upload-photo"
                      className="inline-flex items-center px-1 py-1 bg-white border border-gray-300 rounded-md text-xs text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                    >
                      Upload photo
                    </label>
                    <input
                      type="file"
                      id="upload-photo"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    {validationMessages.image && (
                      <p className="text-sm text-red-500">
                        {validationMessages.image}
                      </p>
                    )}
                  </div>
                  <div className="pt-2">
                    <label className="leading-loose">Post Title</label>
                    <input
                      type="text"
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="Enter Post Title"
                      value={postData.post_title}
                      onChange={(e) => handleInputChange(e, "post_title")}
                    />
                    {validationMessages.post_title && (
                      <p className="text-sm text-red-500">
                        {validationMessages.post_title}
                      </p>
                    )}
                  </div>
                  <div className="pt-2">
                    <label className="leading-loose">Tags</label>
                    <div className="relative">
                      <div className="flex items-center">
                        <input
                          type="text"
                          className="px-4 py-2 border focus:ring-blue-300 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-l-md focus:outline-none text-gray-600 transition ease-in-out duration-150"
                          placeholder="Start typing a tag..."
                          value={newTag}
                          onChange={handleTagInput}
                          onFocus={() => {
                            clearTimeout(blurTimeoutId);
                            setIsInputFocused(true);
                          }}
                          onBlur={handleInputBlur}
                        />
                        {newTag && !checkTagExistence(newTag) && (
                          <button
                            className="inline-flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium leading-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150"
                            onClick={handleCreateTag}
                            aria-label="Add tag"
                          >
                            <svg
                              className="w-4 h-4"
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
                        )}
                      </div>
                      {isInputFocused && (
                        <div className="absolute w-full mt-1 max-h-40 overflow-y-auto border border-gray-300 bg-white rounded-md shadow-lg z-50">
                          {tags
                            .filter((tag) =>
                              tag.tag_name
                                .toLowerCase()
                                .includes(newTag.toLowerCase())
                            )
                            .map((tag) => (
                              <div
                                key={tag.tag_id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer z-50"
                                onClick={() => handleTagSelection(tag)}
                              >
                                {tag.tag_name}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    {validationMessages.tag_id && (
                      <p className="text-sm text-red-500">
                        {validationMessages.tag_id}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Description</label>
                  <textarea
                    type="text"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full h-32 sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Enter a description for the post"
                    value={postData.post_desc}
                    onChange={(e) => handleInputChange(e, "post_desc")}
                  />
                  {validationMessages.post_desc && (
                    <p className="text-sm text-red-500">
                      {validationMessages.post_desc}
                    </p>
                  )}
                </div>
              </div>
              <div className="pt-4 flex items-center space-x-4">
                <button
                  className="flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none"
                  onClick={closeModal}
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>{" "}
                  Cancel
                </button>
                <button
                  className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                  onClick={handleCreatePost}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
