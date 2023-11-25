var db = require("./config/databaseConfig.js");
var Comments = require("./comments");

var commentFunctions = {
  // Function to get all comments
  getAllComments: async function () {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = "SELECT * FROM Comments";
      const [result] = await conn.query(sql);
      const comments = result.map(
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
      return comments;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to create a new comment
  createComment: async function (commentData) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = "INSERT INTO Comments SET ?";
      const [result] = await conn.query(sql, commentData);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to update a comment
  updateComment: async function (commentId, commentData) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = "UPDATE Comments SET ? WHERE comment_id = ?";
      const [result] = await conn.query(sql, [commentData, commentId]);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to delete a comment
  deleteComment: async function (commentId) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = "DELETE FROM Comments WHERE comment_id = ?";
      const [result] = await conn.query(sql, commentId);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to get comments for a specific post
  getCommentsByPostId: async function (postId) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql =
        "SELECT Comments.* , Users.* , Images.* FROM Comments JOIN Users ON Comments.user_id = Users.user_id LEFT JOIN Images ON Users.image_id = Images.image_id WHERE Comments.post_id = ?";
      const [result] = await conn.query(sql, [postId]);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to upvote a comment
  upvoteComment: async function (commentId) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql =
        "UPDATE Comments SET comment_upvotes = comment_upvotes + 1 WHERE comment_id = ?";
      const [result] = await conn.query(sql, commentId);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to downvote a comment
  downvoteComment: async function (commentId) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql =
        "UPDATE Comments SET comment_downvotes = comment_downvotes + 1 WHERE comment_id = ?";
      const [result] = await conn.query(sql, commentId);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to get comments sorted
  getCommentsSorted: async function (sortBy) {
    var conn;
    try {
      conn = await db.getConnection();
      var sql;
      if (sortBy === "upvotes") {
        sql =
          "SELECT Comments.* , Users.* , Images.* FROM Comments JOIN Users ON Comments.user_id = Users.user_id LEFT JOIN Images ON Users.image_id = Images.image_id ORDER BY (comment_upvotes - comment_downvotes) DESC";
      } else if (sortBy === "recent") {
        sql =
          "SELECT Comments.* , Users.* , Images.* FROM Comments JOIN Users ON Comments.user_id = Users.user_id LEFT JOIN Images ON Users.image_id = Images.image_id ORDER BY time_commented DESC";
      }
      const [result] = await conn.query(sql);
      return result;
    } catch (err) {
      console.log("Error executing getCommentsSorted query:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },
};

module.exports = commentFunctions;
