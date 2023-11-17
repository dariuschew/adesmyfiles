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
                    row.comment,
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
          var sql =
            "SELECT Comments.* , Users.* , Images.* FROM Comments JOIN Users ON Comments.user_id = Users.user_id LEFT JOIN Images ON Users.image_id = Images.image_id WHERE Comments.post_id = ?";
          conn.query(sql, [postId], function (err, result) {
            conn.end();
            if (err) {
              console.log(err);
              reject(err);
            } else {
              // var comments = result.map(
              //   (row) =>
              //     new Comments(
              //       row.comment_id,
              //       row.post_id,
              //       row.commenter_id,
              //       row.comment,
              //       row.comment_upvotes,
              //       row.comment_downvotes,
              //       row.time_created
              //     )
              // );
              resolve(result);
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

  // Function to get comments sorted
  getCommentsSorted: function (sortBy) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect((err) => {
        if (err) {
          console.log("Error connecting to database:", err);
          reject(err);
        } else {
          var sql;
          if (sortBy === "upvotes") {
            sql =
              "SELECT Comments.* , Users.* , Images.* FROM Comments JOIN Users ON Comments.user_id = Users.user_id LEFT JOIN Images ON Users.image_id = Images.image_id ORDER BY (comment_upvotes - comment_downvotes) DESC";
          } else if (sortBy === "recent") {
            sql =
              "SELECT Comments.* , Users.* , Images.* FROM Comments JOIN Users ON Comments.user_id = Users.user_id LEFT JOIN Images ON Users.image_id = Images.image_id ORDER BY time_commented DESC";
          }
          conn.query(sql, (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing getCommentsSorted query:", err);
              reject(err);
            } else {
              // var comments = result.map(
              //   (row) =>
              //     new Comments(
              //       row.comment_id,
              //       row.post_id,
              //       row.commenter_id,
              //       row.comment,
              //       row.comment_upvotes,
              //       row.comment_downvotes,
              //       row.time_created
              //     )
              // );
              resolve(result);
            }
          });
        }
      });
    });
  },
};

module.exports = commentFunctions;
