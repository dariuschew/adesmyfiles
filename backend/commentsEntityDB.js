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
app.get("/comments/sorted/:sortBy", function (req, res) {
  var sortBy = req.params.sortBy;
  console.log(`Received request to get comments sorted by: ${sortBy}`);
  comment
    .getCommentsSorted(sortBy)
    .then((comments) => {
    //  const commentObjects = comments.map((c) => c.toObject());
      res.status(200).json(comments);
    })
    .catch((err) => {
      console.error(`Error retrieving comments sorted by ${sortBy}:`, err);
      res.status(500).send(err);
    });
});

module.exports = app;
