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
  comment
    .getAllComments()
    .then((comments) => {
      const commentObjects = comments.map((c) => c.toObject());
      res.status(200).json(commentObjects);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// CREATE a new comment
app.post("/comments", function (req, res) {
  comment
    .createComment(req.body)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// UPDATE a comment
app.put("/comments/:id", function (req, res) {
  var commentId = req.params.id;
  var updateData = req.body;

  comment
    .updateComment(commentId, updateData)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// DELETE a comment
app.delete("/comments/:id", function (req, res) {
  var commentId = req.params.id;

  comment
    .deleteComment(commentId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// GET comments by post ID
app.get("/comments/post/:postId", function (req, res) {
  var postId = req.params.postId;

  comment
    .getCommentsByPostId(postId)
    .then((comments) => {
      // const commentObjects = comments.map((c) => c.toObject());
      res.status(200).json(comments);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// UPVOTE a comment
app.put("/comments/upvote/:id", function (req, res) {
  var commentId = req.params.id;

  comment
    .upvoteComment(commentId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// DOWNVOTE a comment
app.put("/comments/downvote/:id", function (req, res) {
  var commentId = req.params.id;

  comment
    .downvoteComment(commentId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// GET sorted comments
app.get("/comments/sorted/:sortBy/:postId", function (req, res) {
  var sortBy = req.params.sortBy;
  var postId = req.params.postId;
  console.log(
    `Received request to get comments sorted by: ${sortBy} for post: ${postId}`
  );
  comment
    .getCommentsSorted(sortBy, postId)
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((err) => {
      console.error(
        `Error retrieving comments sorted by ${sortBy} for post: ${postId}:`,
        err
      );
      res.status(500).send(err);
    });
});

// GET count of comments by post ID
app.get("/comments/count/:postId", function (req, res) {
  var postId = req.params.postId;

  comment
    .countCommentsByPostId(postId)
    .then((commentCount) => {
      res.status(200).json({ postId: postId, commentCount: commentCount });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// CREATE or UPDATE a vote for a comment
app.post("/comments/:id/vote", function (req, res) {
  const commentId = req.params.id;
  const userId = req.body.userId;
  const voteType = req.body.voteType;

  comment
    .createOrUpdateVote(userId, commentId, voteType)
    .then((result) => {
      res.status(201).json({ message: "Vote registered successfully", result });
    })
    .catch((err) => {
      res.status(500).json({ message: "An error occurred", err });
    });
});

// REMOVE a vote from a comment
app.delete("/comments/:id/vote", function (req, res) {
  const commentId = req.params.id;
  const userId = req.body.userId;

  comment
    .removeVote(userId, commentId)
    .then((result) => {
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Vote removed successfully" });
      } else {
        res.status(404).json({ message: "Vote not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "An error occurred", err });
    });
});

// Get the current vote status of a comment
app.get("/comments/:id/vote-status", async function (req, res) {
  const commentId = req.params.id;
  const userId = req.query.userId;

  try {
    const result = await comment.getVoteStatus(userId, commentId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "An error occurred", err });
  }
});

module.exports = app;
