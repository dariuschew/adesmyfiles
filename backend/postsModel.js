var db = require("./config/databaseConfig.js");
var Posts = require("./posts");

var postFunctions = {
  // Function to get all posts
  getAllPosts: async function () {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = `
        SELECT Posts.*, Images.image_url, Tags.tag_name, 
        Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth, 
        UserImages.image_url AS user_image_url 
        FROM Posts 
        LEFT JOIN Images ON Posts.image_id = Images.image_id 
        LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id 
        LEFT JOIN Users ON Posts.poster_id = Users.user_id 
        LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id`;

      const [result] = await conn.query(sql);
      const posts = result.map(
        (row) =>
          new Posts(
            row.post_id,
            row.post_title,
            row.post_desc,
            row.image_url,
            row.comment_count,
            row.post_upvotes,
            row.post_downvotes,
            row.time_created,
            row.tag_name,
            row.full_name,
            row.username,
            row.email,
            row.class,
            row.date_of_birth,
            row.user_image_url
          )
      );
      return posts;
    } catch (error) {
      console.error("Error executing getAllPosts query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to create a new post
  createPost: async function (postData) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = "INSERT INTO Posts SET ?";
      const [result] = await conn.query(sql, postData);
      return result;
    } catch (error) {
      console.error("Error executing createPost query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to update a post
  updatePost: async function (postId, postData) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = "UPDATE Posts SET ? WHERE post_id = ?";
      const [result] = await conn.query(sql, [postData, postId]);
      return result;
    } catch (error) {
      console.error("Error executing updatePost query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to delete a post
  deletePost: async function (postId) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = "DELETE FROM Posts WHERE post_id = ?";
      const [result] = await conn.query(sql, postId);
      return result;
    } catch (error) {
      console.error("Error executing deletePost query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to search posts by title
  searchPostsByTitle: async function (searchTerm) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = `SELECT Posts.*, Images.image_url, Tags.tag_name, Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth, UserImages.image_url AS user_image_url FROM Posts LEFT JOIN Images ON Posts.image_id = Images.image_id LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id LEFT JOIN Users ON Posts.poster_id = Users.user_id LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id WHERE Posts.post_title LIKE ?`;
      const likeTerm = "%" + searchTerm + "%";
      const [result] = await conn.query(sql, likeTerm);
      const posts = result.map(
        (row) =>
          new Posts(
            row.post_id,
            row.post_title,
            row.post_desc,
            row.image_url,
            row.comment_count,
            row.post_upvotes,
            row.post_downvotes,
            row.time_created,
            row.tag_name,
            row.full_name,
            row.username,
            row.email,
            row.class,
            row.date_of_birth,
            row.user_image_url
          )
      );
      return posts;
    } catch (error) {
      console.error("Error executing searchPostsByTitle query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to search posts by tag ID
  searchPostsByTag: async function (tagName) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = `
        SELECT Posts.*, Images.image_url, Tags.tag_name, 
        Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth, 
        UserImages.image_url AS user_image_url 
        FROM Posts 
        LEFT JOIN Images ON Posts.image_id = Images.image_id 
        INNER JOIN Tags ON Posts.tag_id = Tags.tag_id 
        LEFT JOIN Users ON Posts.poster_id = Users.user_id 
        LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id 
        WHERE Tags.tag_name = ?`;
      const [result] = await conn.query(sql, [tagName]);
      const posts = result.map(
        (row) =>
          new Posts(
            row.post_id,
            row.post_title,
            row.post_desc,
            row.image_url,
            row.comment_count,
            row.post_upvotes,
            row.post_downvotes,
            row.time_created,
            row.tag_name,
            row.full_name,
            row.username,
            row.email,
            row.class,
            row.date_of_birth,
            row.user_image_url
          )
      );
      return posts;
    } catch (error) {
      console.error("Error executing searchPostsByTag query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to upvote a post
  upvotePost: async function (postId) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql =
        "UPDATE Posts SET post_upvotes = post_upvotes + 1 WHERE post_id = ?";
      const [result] = await conn.query(sql, postId);
      return result;
    } catch (error) {
      console.error("Error executing upvotePost query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to downvote a post
  downvotePost: async function (postId) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql =
        "UPDATE Posts SET post_downvotes = post_downvotes + 1 WHERE post_id = ?";
      const [result] = await conn.query(sql, postId);
      return result;
    } catch (error) {
      console.error("Error executing downvotePost query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to get posts with sorting
  getPostsSorted: async function (sortBy) {
    var conn;
    try {
      conn = await db.getConnection();
      var baseSql = `
        SELECT Posts.*, Images.image_url, Tags.tag_name, 
        Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth, 
        UserImages.image_url AS user_image_url 
        FROM Posts 
        LEFT JOIN Images ON Posts.image_id = Images.image_id 
        LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id 
        LEFT JOIN Users ON Posts.poster_id = Users.user_id 
        LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id `;

      var sql = baseSql;
      if (sortBy === "upvotes") {
        sql += "ORDER BY (Posts.post_upvotes)-(Posts.post_downvotes) DESC";
      } else if (sortBy === "recent") {
        sql += "ORDER BY Posts.time_created DESC";
      }

      const [result] = await conn.query(sql);
      const posts = result.map(
        (row) =>
          new Posts(
            row.post_id,
            row.post_title,
            row.post_desc,
            row.image_url,
            row.comment_count,
            row.post_upvotes,
            row.post_downvotes,
            row.time_created,
            row.tag_name,
            row.full_name,
            row.username,
            row.email,
            row.class,
            row.date_of_birth,
            row.user_image_url
          )
      );
      return posts;
    } catch (error) {
      console.error("Error executing getPostsSorted query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to search and sort posts
  searchAndSortPosts: async function (searchTerm, sortBy) {
    var conn;
    try {
      conn = await db.getConnection();
      var baseSql = `
        SELECT Posts.*, Images.image_url, Tags.tag_name, 
        Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth, 
        UserImages.image_url AS user_image_url 
        FROM Posts 
        LEFT JOIN Images ON Posts.image_id = Images.image_id 
        LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id 
        LEFT JOIN Users ON Posts.poster_id = Users.user_id 
        LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id `;

      var searchClause = searchTerm ? "WHERE Posts.post_title LIKE ? " : "";
      var sortClause = "";
      if (sortBy === "upvotes") {
        sortClause =
          "ORDER BY (Posts.post_upvotes)-(Posts.post_downvotes) DESC";
      } else if (sortBy === "recent") {
        sortClause = "ORDER BY Posts.time_created DESC";
      }

      var sql = baseSql + searchClause + sortClause;

      const [result] = await conn.query(
        sql,
        searchTerm ? ["%" + searchTerm + "%"] : []
      );
      const posts = result.map(
        (row) =>
          new Posts(
            row.post_id,
            row.post_title,
            row.post_desc,
            row.image_url,
            row.comment_count,
            row.post_upvotes,
            row.post_downvotes,
            row.time_created,
            row.tag_name,
            row.full_name,
            row.username,
            row.email,
            row.class,
            row.date_of_birth,
            row.user_image_url
          )
      );
      return posts;
    } catch (error) {
      console.error("Error executing searchAndSortPosts query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to get a single post by its ID
  getPostById: async function (postId) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = `
        SELECT Posts.*, Images.image_url, Tags.tag_name, 
        Users.user_id , Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth, 
        UserImages.image_url AS user_image_url 
        FROM Posts 
        LEFT JOIN Images ON Posts.image_id = Images.image_id 
        LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id 
        LEFT JOIN Users ON Posts.poster_id = Users.user_id 
        LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id 
        WHERE Posts.post_id = ?`;
      const [result] = await conn.query(sql, [postId]);
      return result;
    } catch (error) {
      console.error("Error executing getPostById query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },
};

module.exports = postFunctions;
