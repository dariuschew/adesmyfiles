var post = require("../model/postsModel.js");

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET all posts
app.get("/posts", function (req, res) {
  console.log("Received request to get all posts.");
  post.getAllPosts(function (err, result) {
    if (!err) {
      console.log("Successfully retrieved all posts.");
      res.status(200).send(result);
    } else {
      console.error("Error retrieving all posts:", err);
      res.status(500).send(err);
    }
  });
});

// CREATE a new post
app.post("/posts", function (req, res) {
  var postData = req.body;
  console.log("Received request to create a new post with data:", postData);
  post.createPost(postData, function (err, result) {
    if (!err) {
      console.log("Successfully created a new post.");
      res.status(201).send(result);
    } else {
      console.error("Error creating a new post:", err);
      res.status(500).send(err);
    }
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
  post.updatePost(postId, updateData, function (err, result) {
    if (!err) {
      console.log(`Successfully updated post with ID ${postId}.`);
      res.status(200).send(result);
    } else {
      console.error(`Error updating post with ID ${postId}:`, err);
      res.status(500).send(err);
    }
  });
});

// DELETE a post
app.delete("/posts/:id", function (req, res) {
  var postId = req.params.id;
  console.log(`Received request to delete post with ID ${postId}.`);
  post.deletePost(postId, function (err, result) {
    if (!err) {
      console.log(`Successfully deleted post with ID ${postId}.`);
      res.status(200).send({ message: "Post deleted successfully" });
    } else {
      console.error(`Error deleting post with ID ${postId}:`, err);
      res.status(500).send(err);
    }
  });
});

// SEARCH for posts by title
app.get("/posts/search", function (req, res) {
  var searchTerm = req.query.title;
  console.log("Received request to search posts with title like:", searchTerm);
  post.searchPostsByTitle(searchTerm, function (err, result) {
    if (!err) {
      console.log("Successfully retrieved posts with titles like:", searchTerm);
      res.status(200).send(result);
    } else {
      console.error("Error searching posts by title:", err);
      res.status(500).send(err);
    }
  });
});

// SEARCH for posts by tag
app.get("/posts/tag/:tagId", function (req, res) {
  var tagId = req.params.tagId;
  console.log("Received request to search posts with tag ID:", tagId);
  post.searchPostsByTag(tagId, function (err, result) {
    if (!err) {
      console.log("Successfully retrieved posts for tag ID:", tagId);
      res.status(200).send(result);
    } else {
      console.error("Error searching posts by tag ID:", err);
      res.status(500).send(err);
    }
  });
});

// UPVOTE a post
app.post("/posts/:id/upvote", function (req, res) {
  var postId = req.params.id;
  console.log("Received request to upvote post with ID:", postId);
  post.upvotePost(postId, function (err, result) {
    if (!err) {
      console.log(`Successfully upvoted post with ID ${postId}.`);
      res.status(200).send({ message: "Post upvoted successfully" });
    } else {
      console.error(`Error upvoting post with ID ${postId}:`, err);
      res.status(500).send(err);
    }
  });
});

// DOWNVOTE a post
app.post("/posts/:id/downvote", function (req, res) {
  var postId = req.params.id;
  console.log("Received request to downvote post with ID:", postId);
  post.downvotePost(postId, function (err, result) {
    if (!err) {
      console.log(`Successfully downvoted post with ID ${postId}.`);
      res.status(200).send({ message: "Post downvoted successfully" });
    } else {
      console.error(`Error downvoting post with ID ${postId}:`, err);
      res.status(500).send(err);
    }
  });
});

// GET sorted posts
app.get("/posts/sorted/:sortBy", function (req, res) {
  var sortBy = req.params.sortBy;
  console.log(`Received request to get posts sorted by: ${sortBy}`);
  post.getPostsSorted(sortBy, function (err, result) {
    if (!err) {
      console.log(`Successfully retrieved posts sorted by ${sortBy}.`);
      res.status(200).send(result);
    } else {
      console.error(`Error retrieving posts sorted by ${sortBy}:`, err);
      res.status(500).send(err);
    }
  });
});

module.exports = app;
