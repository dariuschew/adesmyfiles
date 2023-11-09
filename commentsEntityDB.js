var comment = require("../model/commentsModel.js");

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET all comments
app.get("/comments", function (req, res) {
  console.log("Received request to get all comments.");
  comment.getAllComments(function (err, result) {
    if (!err) {
      console.log("Successfully retrieved all comments.");
      res.status(200).send(result);
    } else {
      console.error("Error retrieving all comments:", err);
      res.status(500).send(err);
    }
  });
});

// CREATE a new comment
app.post("/comments", function (req, res) {
  var commentData = req.body;
  console.log(
    "Received request to create a new comment with data:",
    commentData
  );
  comment.createComment(commentData, function (err, result) {
    if (!err) {
      console.log("Successfully created a new comment.");
      res.status(201).send(result);
    } else {
      console.error("Error creating a new comment:", err);
      res.status(500).send(err);
    }
  });
});

// UPDATE a comment
app.put("/comments/:id", function (req, res) {
  var commentId = req.params.id;
  var updateData = req.body;
  console.log(
    `Received request to update comment with ID ${commentId} with data:`,
    updateData
  );
  comment.updateComment(commentId, updateData, function (err, result) {
    if (!err) {
      console.log(`Successfully updated comment with ID ${commentId}.`);
      res.status(200).send(result);
    } else {
      console.error(`Error updating comment with ID ${commentId}:`, err);
      res.status(500).send(err);
    }
  });
});

// DELETE a comment
app.delete("/comments/:id", function (req, res) {
  var commentId = req.params.id;
  console.log(`Received request to delete comment with ID ${commentId}.`);
  comment.deleteComment(commentId, function (err, result) {
    if (!err) {
      console.log(`Successfully deleted comment with ID ${commentId}.`);
      res.status(200).send(result);
    } else {
      console.error(`Error deleting comment with ID ${commentId}:`, err);
      res.status(500).send(err);
    }
  });
});

// GET comments by post ID
app.get("/comments/post/:postId", function (req, res) {
  var postId = req.params.postId;
  console.log(`Received request to get comments for post with ID ${postId}.`);
  comment.getCommentsByPostId(postId, function (err, result) {
    if (!err) {
      console.log(
        `Successfully retrieved comments for post with ID ${postId}.`
      );
      res.status(200).send(result);
    } else {
      console.error(
        `Error retrieving comments for post with ID ${postId}:`,
        err
      );
      res.status(500).send(err);
    }
  });
});

// UPVOTE a comment
app.put("/comments/upvote/:id", function (req, res) {
  var commentId = req.params.id;
  console.log(`Received request to upvote comment with ID ${commentId}.`);
  comment.upvoteComment(commentId, function (err, result) {
    if (!err) {
      console.log(`Successfully upvoted comment with ID ${commentId}.`);
      res.status(200).send(result);
    } else {
      console.error(`Error upvoting comment with ID ${commentId}:`, err);
      res.status(500).send(err);
    }
  });
});

// DOWNVOTE a comment
app.put("/comments/downvote/:id", function (req, res) {
  var commentId = req.params.id;
  console.log(`Received request to downvote comment with ID ${commentId}.`);
  comment.downvoteComment(commentId, function (err, result) {
    if (!err) {
      console.log(`Successfully downvoted comment with ID ${commentId}.`);
      res.status(200).send(result);
    } else {
      console.error(`Error downvoting comment with ID ${commentId}:`, err);
      res.status(500).send(err);
    }
  });
});

module.exports = app;
