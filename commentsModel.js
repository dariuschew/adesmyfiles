var db = require("./config/databaseConfig.js");

var commentFunctions = {
  // Function to get all comments
  getAllComments: function (callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql = "SELECT * FROM Comments";
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

  // Function to create a new comment
  createComment: function (commentData, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err);
      } else {
        var sql = "INSERT INTO Comments SET ?";
        conn.query(sql, commentData, function (err, result) {
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

  // Function to update a comment
  updateComment: function (commentId, commentData, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err);
      } else {
        var sql = "UPDATE Comments SET ? WHERE comment_id = ?";
        conn.query(sql, [commentData, commentId], function (err, result) {
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

  // Function to delete a comment
  deleteComment: function (commentId, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err);
      } else {
        var sql = "DELETE FROM Comments WHERE comment_id = ?";
        conn.query(sql, commentId, function (err, result) {
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

  // Function to get comments for a specific post
  getCommentsByPostId: function (postId, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql = "SELECT * FROM Comments WHERE post_id = ?";
        conn.query(sql, [postId], function (err, result) {
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

  // Function to upvote a comment
  upvoteComment: function (commentId, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err);
      } else {
        var sql =
          "UPDATE Comments SET comment_upvotes = comment_upvotes + 1 WHERE comment_id = ?";
        conn.query(sql, commentId, function (err, result) {
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

  // Function to downvote a comment
  downvoteComment: function (commentId, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err);
      } else {
        var sql =
          "UPDATE Comments SET comment_downvotes = comment_downvotes + 1 WHERE comment_id = ?";
        conn.query(sql, commentId, function (err, result) {
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
};

module.exports = commentFunctions;
