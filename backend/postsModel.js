var db = require("./config/databaseConfig.js");
var Posts = require("./posts");

var postFunctions = {
  // Function to get all posts
  getAllPosts: function () {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect((err) => {
        if (err) {
          console.log("Error connecting to database:", err);
          reject(err);
        } else {
          var sql =
            "SELECT Posts.*, Images.image_url, Tags.tag_name, " +
            "Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth, " +
            "UserImages.image_url AS user_image_url " +
            "FROM Posts " +
            "LEFT JOIN Images ON Posts.image_id = Images.image_id " +
            "LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id " +
            "LEFT JOIN Users ON Posts.poster_id = Users.user_id " +
            "LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id";
          conn.query(sql, (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing getAllPosts query:", err);
              reject(err);
            } else {
              // Map the result to create Posts instances
              var posts = result.map(
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
              resolve(posts);
            }
          });
        }
      });
    });
  },

  // Function to create a new post
  createPost: function (postData) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect((err) => {
        if (err) {
          console.log("Error connecting to database:", err);
          reject(err);
        } else {
          var sql = "INSERT INTO Posts SET ?";
          conn.query(sql, postData, (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing createPost query:", err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  },

  // Function to update a post
  updatePost: function (postId, postData) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect((err) => {
        if (err) {
          console.log("Error connecting to database:", err);
          reject(err);
        } else {
          var sql = "UPDATE Posts SET ? WHERE post_id = ?";
          conn.query(sql, [postData, postId], (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing updatePost query:", err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  },

  // Function to delete a post
  deletePost: function (postId) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect((err) => {
        if (err) {
          console.log("Error connecting to database:", err);
          reject(err);
        } else {
          var sql = "DELETE FROM Posts WHERE post_id = ?";
          conn.query(sql, postId, (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing deletePost query:", err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  },

  // Function to search posts by title
  searchPostsByTitle: function (searchTerm) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect((err) => {
        if (err) {
          console.log("Error connecting to database:", err);
          reject(err);
        } else {
          var sql =
            "SELECT Posts.*, Images.image_url, Tags.tag_name, " +
            "Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth, " +
            "UserImages.image_url AS user_image_url " +
            "FROM Posts " +
            "LEFT JOIN Images ON Posts.image_id = Images.image_id " +
            "LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id " +
            "LEFT JOIN Users ON Posts.poster_id = Users.user_id " +
            "LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id " +
            "WHERE Posts.post_title LIKE ?";
          var likeTerm = "%" + searchTerm + "%";
          conn.query(sql, likeTerm, (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing searchPostsByTitle query:", err);
              reject(err);
            } else {
              // Map the result to create Posts instances
              var posts = result.map(
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
              resolve(posts);
            }
          });
        }
      });
    });
  },

  // Function to search posts by tag ID
  searchPostsByTag: function (tagId) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect((err) => {
        if (err) {
          console.log("Error connecting to database:", err);
          reject(err);
        } else {
          var sql =
            "SELECT Posts.*, Images.image_url, Tags.tag_name, " +
            "Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth, " +
            "UserImages.image_url AS user_image_url " +
            "FROM Posts " +
            "LEFT JOIN Images ON Posts.image_id = Images.image_id " +
            "INNER JOIN Tags ON Posts.tag_id = Tags.tag_id " +
            "LEFT JOIN Users ON Posts.poster_id = Users.user_id " +
            "LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id " +
            "WHERE Tags.tag_id = ?";
          conn.query(sql, tagId, (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing searchPostsByTag query:", err);
              reject(err);
            } else {
              // Map the result to create Posts instances
              var posts = result.map(
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
              resolve(posts);
            }
          });
        }
      });
    });
  },

  // Function to upvote a post
  upvotePost: function (postId) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect((err) => {
        if (err) {
          console.log("Error connecting to database:", err);
          reject(err);
        } else {
          var sql =
            "UPDATE Posts SET post_upvotes = post_upvotes + 1 WHERE post_id = ?";
          conn.query(sql, postId, (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing upvotePost query:", err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  },

  // Function to downvote a post
  downvotePost: function (postId) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect((err) => {
        if (err) {
          console.log("Error connecting to database:", err);
          reject(err);
        } else {
          var sql =
            "UPDATE Posts SET post_downvotes = post_downvotes + 1 WHERE post_id = ?";
          conn.query(sql, postId, (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing downvotePost query:", err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  },

  // Function to get posts with sorting
  getPostsSorted: function (sortBy) {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect((err) => {
        if (err) {
          console.log("Error connecting to database:", err);
          reject(err);
        } else {
          var sql;
          var baseSql =
            "SELECT Posts.*, Images.image_url, Tags.tag_name, " +
            "Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth, " +
            "UserImages.image_url AS user_image_url " +
            "FROM Posts " +
            "LEFT JOIN Images ON Posts.image_id = Images.image_id " +
            "LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id " +
            "LEFT JOIN Users ON Posts.poster_id = Users.user_id " +
            "LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id ";
          if (sortBy === "upvotes") {
            sql = baseSql + "ORDER BY Posts.post_upvotes DESC";
          } else if (sortBy === "recent") {
            sql = baseSql + "ORDER BY Posts.time_created DESC";
          }
          conn.query(sql, (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing getPostsSorted query:", err);
              reject(err);
            } else {
              // Map the result to create Posts instances
              var posts = result.map(
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
              resolve(posts);
            }
          });
        }
      });
    });
  },
};

module.exports = postFunctions;
