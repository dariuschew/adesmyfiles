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

  // Function to get comments for a specific post (SEQUENTIAL)
  getCommentsByPostId: async function (postId) {
    var conn;
    try {
      conn = await db.getConnection();
      let comments = [];

      const commentsSql = "SELECT * FROM Comments WHERE post_id = ?";
      const [commentsResult] = await conn.query(commentsSql, [postId]);

      for (const comment of commentsResult) {
        const userSql = "SELECT * FROM Users WHERE user_id = ?";
        const [userResult] = await conn.query(userSql, [comment.user_id]);
        const user = userResult[0];

        let image = null;
        if (user && user.image_id) {
          const imageSql = "SELECT * FROM Images WHERE image_id = ?";
          const [imageResult] = await conn.query(imageSql, [user.image_id]);
          image = imageResult[0];
        }

        comments.push({
          ...comment,
          ...user,
          image_url: image ? image.image_url : null,
          public_id: image ? image.public_id : null,
        });
      }
      return comments;
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

  // Function to get comments sorted (SEQUENTIAL)
  getCommentsSorted: async function (sortBy, postId) {
    var conn;
    try {
      conn = await db.getConnection();
      let comments = [];

      let sortSql =
        sortBy === "upvotes"
          ? "comment_upvotes - comment_downvotes DESC"
          : "time_commented DESC";

      const commentsSql = `SELECT * FROM Comments WHERE post_id = ? ORDER BY ${sortSql}`;
      const [commentsResult] = await conn.query(commentsSql, [postId]);

      for (const comment of commentsResult) {
        const userSql = "SELECT * FROM Users WHERE user_id = ?";
        const [userResult] = await conn.query(userSql, [comment.user_id]);
        const user = userResult[0] || {};

        let image = null;
        if (user.image_id) {
          const imageSql = "SELECT * FROM Images WHERE image_id = ?";
          const [imageResult] = await conn.query(imageSql, [user.image_id]);
          image = imageResult[0] || {};
        }

        comments.push({
          ...comment,
          ...user,
          image_url: image ? image.image_url : null,
          public_id: image ? image.public_id : null,
        });
      }

      return comments;
    } catch (err) {
      console.log("Error executing getCommentsSorted query:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to count comments for a specific post [DATA MANIPULATION]
  countCommentsByPostId: async function (postId) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql =
        "SELECT COUNT(*) AS commentCount FROM Comments WHERE post_id = ?";
      const [result] = await conn.query(sql, [postId]);
      const commentCount = result[0].commentCount;
      return commentCount;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },
};

module.exports = commentFunctions;
