var tags = require("../model/tagsModel.js");

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET all comments
app.get("/tags", function (req, res) {
  console.log("Received request to get all tags.");
  tags.getAllTags(function (err, result) {
    if (!err) {
      console.log("Successfully retrieved all tags.");
      res.status(200).send(result);
    } else {
      console.error("Error retrieving all tags:", err);
      res.status(500).send(err);
    }
  });
});

module.exports = app;
