var tags = require("../model/tagsModel.js");

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET all tags
app.get("/tags", function (req, res) {
  console.log("Received request to get all tags.");
  tags
    .getAllTags()
    .then((tags) => {
      console.log("Successfully retrieved all tags.");
      const tagObjects = tags.map((tag) => tag.toObject());
      res.status(200).json(tagObjects); // Send as JSON
    })
    .catch((err) => {
      console.error("Error retrieving all tags:", err);
      res.status(500).send(err);
    });
});

// POST route to create a new tag
app.post("/tags", function (req, res) {
  const tagName = req.body.tagName;
  console.log("Received request to create a new tag with name:", tagName);

  tags
    .createTag(tagName)
    .then((newTag) => {
      console.log("Successfully created a new tag.");
      res.status(201).json(newTag.toObject());
    })
    .catch((err) => {
      console.error("Error creating a new tag:", err);
      res.status(500).send(err);
    });
});

module.exports = app;
