var post = require("../model/postsModel.js");

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET all posts with pagination
app.get("/posts", function (req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const sortBy = req.query.sortBy || "";

  console.log(
    `Received request to get all posts. Page: ${page}, Limit: ${limit}`
  );

  post
    .getAllPosts(page, limit, sortBy)
    .then((data) => {
      const { total, posts } = data;
      console.log(
        `Retrieved posts. Total: ${total}, Posts on current page: ${posts.length}`
      );
      res.status(200).json({
        total: total,
        posts: posts.map((p) => p.toObject()),
      });
    })
    .catch((err) => {
      console.error("Error retrieving all posts:", err);
      res.status(500).send(err);
    });
});

// CREATE a new post
app.post("/posts", function (req, res) {
  var postData = req.body;
  console.log("Received request to create a new post with data:", postData);
  post
    .createPost(postData)
    .then((result) => {
      console.log("Successfully created a new post.");
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error creating a new post:", err);
      res.status(500).send(err);
    });
});

// UPDATE a post
app.put("/posts/:id", function (req, res) {
  var postId = req.params.id;
  var updateData = req.body;
  console.log(
    `Received request to update post with ID ${postId} with data:`,
    updateData
  );
  post
    .updatePost(postId, updateData)
    .then((result) => {
      console.log(`Successfully updated post with ID ${postId}.`);
      res.status(200).send(result);
    })
    .catch((err) => {
      console.error(`Error updating post with ID ${postId}:`, err);
      res.status(500).send(err);
    });
});

// DELETE a post
app.delete("/posts/:id", function (req, res) {
  var postId = req.params.id;
  console.log(`Received request to delete post with ID ${postId}.`);
  post
    .deletePost(postId)
    .then((result) => {
      console.log(`Successfully deleted post with ID ${postId}.`);
      res.status(200).send({ message: "Post deleted successfully" });
    })
    .catch((err) => {
      console.error(`Error deleting post with ID ${postId}:`, err);
      res.status(500).send(err);
    });
});

// SEARCH for posts by title
app.get("/posts/title/:searchTerm", function (req, res) {
  var searchTerm = req.params.searchTerm;
  console.log("Received request to search posts with title:", searchTerm);
  post
    .searchPostsByTitle(searchTerm)
    .then((posts) => {
      const postObjects = posts.map((p) => p.toObject());
      res.status(200).json(postObjects);
    })
    .catch((err) => {
      console.error("Error searching posts by title:", err);
      res.status(500).send(err);
    });
});

// SEARCH for posts by tag name
app.get("/posts/tag/:tagName", function (req, res) {
  var tagName = req.params.tagName;
  console.log("Received request to search posts with tag name:", tagName);
  post
    .searchPostsByTag(tagName)
    .then((posts) => {
      const postObjects = posts.map((p) => p.toObject());
      res.status(200).json(postObjects);
    })
    .catch((err) => {
      console.error("Error searching posts by tag name:", err);
      res.status(500).send(err);
    });
});

// UPVOTE a post
app.post("/posts/:id/upvote", function (req, res) {
  var postId = req.params.id;
  console.log("Received request to upvote post with ID:", postId);
  post
    .upvotePost(postId)
    .then((result) => {
      console.log(`Successfully upvoted post with ID ${postId}.`);
      res.status(200).send({ message: "Post upvoted successfully" });
    })
    .catch((err) => {
      console.error(`Error upvoting post with ID ${postId}:`, err);
      res.status(500).send(err);
    });
});

// DOWNVOTE a post
app.post("/posts/:id/downvote", function (req, res) {
  var postId = req.params.id;
  console.log("Received request to downvote post with ID:", postId);
  post
    .downvotePost(postId)
    .then((result) => {
      console.log(`Successfully downvoted post with ID ${postId}.`);
      res.status(200).send({ message: "Post downvoted successfully" });
    })
    .catch((err) => {
      console.error(`Error downvoting post with ID ${postId}:`, err);
      res.status(500).send(err);
    });
});

// GET sorted and paginated posts
app.get("/posts/sorted/:sortBy", function (req, res) {
  const sortBy = req.params.sortBy;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const offset = (page - 1) * limit;

  console.log(
    `Received request to get posts sorted by: ${sortBy} with page: ${page} and limit: ${limit}`
  );
  post
    .getPostsSorted(sortBy, limit, offset)
    .then((data) => {
      res.status(200).json({
        total: data.total,
        posts: data.posts.map((post) => post.toObject()),
      });
    })
    .catch((err) => {
      console.error(`Error retrieving posts sorted by ${sortBy}:`, err);
      res.status(500).send(err);
    });
});

//GET Combined search and sort endpoint
app.get("/posts/search-and-sort", function (req, res) {
  const searchTerm = req.query.searchTerm;
  const sortBy = req.query.sortBy;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const offset = (page - 1) * limit;
  const searchType = req.query.searchType;

  console.log(
    `Received request to search and sort posts by: searchTerm=${searchTerm}, sortBy=${sortBy}, page=${page}, limit=${limit} , searchType=${searchType}`
  );

  post
    .searchAndSortPosts(searchTerm, sortBy, limit, offset, searchType)
    .then((data) => {
      res.status(200).json({
        total: data.total,
        posts: data.posts.map((post) => post.toObject()),
      });
    })
    .catch((err) => {
      console.error("Error searching and sorting posts:", err);
      res.status(500).send(err);
    });
});

// GET a single post by ID
app.get("/posts/:id", function (req, res) {
  var postId = req.params.id;
  console.log(`Received request to get post with ID: ${postId}`);
  post
    .getPostById(postId)
    .then((posts) => {
      if (posts) {
        // const postObjects = posts.map((post) => post.toObject());
        res.status(200).json(posts);
      } else {
        console.error("Error searching and sorting posts:", err);
        res.status(404).send({ message: "Post not found" });
      }
    })
    .catch((err) => {
      console.error(`Error retrieving post with ID ${postId}:`, err);
      res.status(500).send(err);
    });
});

// INCREMENT comment count for a post
app.post("/posts/:id/increment-comment-count", async function (req, res) {
  var postId = req.params.id;
  console.log(
    `Received request to increment comment count for post with ID: ${postId}`
  );

  try {
    await post.incrementCommentCount(postId);
    console.log(
      `Successfully incremented comment count for post with ID ${postId}.`
    );
    res.status(200).json({ message: "Comment count incremented successfully" });
  } catch (err) {
    console.error(
      `Error incrementing comment count for post with ID ${postId}:`,
      err
    );
    res.status(500).send(err);
  }
});

// DECREMENT comment count for a post
app.post("/posts/:id/decrement-comment-count", async function (req, res) {
  var postId = req.params.id;
  console.log(
    `Received request to decrement comment count for post with ID: ${postId}`
  );

  try {
    await post.decrementCommentCount(postId);
    console.log(
      `Successfully decremented comment count for post with ID ${postId}.`
    );
    res.status(200).json({ message: "Comment count decremented successfully" });
  } catch (err) {
    console.error(
      `Error decrementing comment count for post with ID ${postId}:`,
      err
    );
    res.status(500).send(err);
  }
});

//[DATA MANIUPLATION]
app.get("/top-contributors", async function (req, res) {
  try {
    const contributors = await post.getTopContributors();
    res.status(200).json(contributors);
  } catch (err) {
    console.error("Error retrieving top contributors:", err);
    res.status(500).send(err);
  }
});

module.exports = app;
