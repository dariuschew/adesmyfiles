var db = require("./config/databaseConfig.js");

var postFunctions = {
  // Function to get all posts
  getAllPosts: function (callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql = "SELECT * FROM Posts";
        conn.query(sql, function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  },

  // Function to create a new post
  createPost: function (postData, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err);
      } else {
        var sql = "INSERT INTO Posts SET ?";
        conn.query(sql, postData, function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  },

  // Function to update a post
  updatePost: function (postId, postData, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err);
      } else {
        var sql = "UPDATE Posts SET ? WHERE post_id = ?";
        conn.query(sql, [postData, postId], function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  },

  // Function to delete a post
  deletePost: function (postId, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err);
      } else {
        var sql = "DELETE FROM Posts WHERE post_id = ?";
        conn.query(sql, postId, function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  },

  // Function to search posts by title
  searchPostsByTitle: function (searchTerm, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql = "SELECT * FROM Posts WHERE post_title LIKE ?";
        var likeTerm = "%" + searchTerm + "%";
        conn.query(sql, likeTerm, function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  },

  // Function to search posts by tag ID
  searchPostsByTag: function (tagId, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        // Assuming a simple direct relationship between Posts and Tags for the example
        var sql =
          "SELECT Posts.* FROM Posts INNER JOIN Tags ON Posts.tag_id = Tags.tag_id WHERE Tags.tag_id = ?";
        conn.query(sql, tagId, function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  },

  // Function to upvote a post
  upvotePost: function (postId, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err);
      } else {
        var sql =
          "UPDATE Posts SET post_upvotes = post_upvotes + 1 WHERE post_id = ?";
        conn.query(sql, postId, function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  },

  // Function to downvote a post
  downvotePost: function (postId, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err);
      } else {
        var sql =
          "UPDATE Posts SET post_downvotes = post_downvotes + 1 WHERE post_id = ?";
        conn.query(sql, postId, function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  },

  // Function to get posts with sorting
  getPostsSorted: function (sortBy, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql;
        if (sortBy === "upvotes") {
          sql = "SELECT * FROM Posts ORDER BY post_upvotes DESC";
        } else if (sortBy === "recent") {
          sql = "SELECT * FROM Posts ORDER BY time_created DESC";
        }
        conn.query(sql, function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  },
};

module.exports = postFunctions;
