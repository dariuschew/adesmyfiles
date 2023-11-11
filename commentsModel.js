var db = require("./config/databaseConfig.js");
var Comments = require("./comments");

var commentFunctions = {
  // Function to get all comments
  getAllComments: function () {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect(function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var sql = "SELECT * FROM Comments";
          conn.query(sql, function (err, result) {
            conn.end();
            if (err) {
              console.log(err);
              reject(err);
            } else {
              var comments = result.map(
                (row) =>
                  new Comments(
                    row.comment_id,
                    row.post_id,
                    row.commenter_id,
                    row.comment_text,
                    row.comment_upvotes,
                    row.comment_downvotes,
                    row.time_created
                  )
              );
              resolve(comments);
            }
          });
        }
      });
    });
  },

  // Function to create a new comment
  createComment: function (commentData) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect(function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var sql = "INSERT INTO Comments SET ?";
          conn.query(sql, commentData, function (err, result) {
            conn.end();
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  },

  // Function to update a comment
  updateComment: function (commentId, commentData) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect(function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var sql = "UPDATE Comments SET ? WHERE comment_id = ?";
          conn.query(sql, [commentData, commentId], function (err, result) {
            conn.end();
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  },

  // Function to delete a comment
  deleteComment: function (commentId) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect(function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var sql = "DELETE FROM Comments WHERE comment_id = ?";
          conn.query(sql, commentId, function (err, result) {
            conn.end();
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  },

  // Function to get comments for a specific post
  getCommentsByPostId: function (postId) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect(function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var sql = "SELECT * FROM Comments WHERE post_id = ?";
          conn.query(sql, [postId], function (err, result) {
            conn.end();
            if (err) {
              console.log(err);
              reject(err);
            } else {
              var comments = result.map(
                (row) =>
                  new Comments(
                    row.comment_id,
                    row.post_id,
                    row.commenter_id,
                    row.comment_text,
                    row.comment_upvotes,
                    row.comment_downvotes,
                    row.time_created
                  )
              );
              resolve(comments);
            }
          });
        }
      });
    });
  },

  // Function to upvote a comment
  upvoteComment: function (commentId) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect(function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var sql =
            "UPDATE Comments SET comment_upvotes = comment_upvotes + 1 WHERE comment_id = ?";
          conn.query(sql, commentId, function (err, result) {
            conn.end();
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  },

  // Function to downvote a comment
  downvoteComment: function (commentId) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect(function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var sql =
            "UPDATE Comments SET comment_downvotes = comment_downvotes + 1 WHERE comment_id = ?";
          conn.query(sql, commentId, function (err, result) {
            conn.end();
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  },
};

module.exports = commentFunctions;
