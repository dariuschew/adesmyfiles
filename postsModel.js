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
          var sql = "SELECT * FROM Posts";
          conn.query(sql, (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing getAllPosts query:", err);
              reject(err);
            } else {
              var posts = result.map(
                (row) =>
                  new Posts(
                    row.post_id,
                    row.poster_id,
                    row.tag_id,
                    row.post_title,
                    row.post_desc,
                    row.image_url,
                    row.comment_count,
                    row.post_upvotes,
                    row.post_downvotes,
                    row.time_created
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
          var sql = "SELECT * FROM Posts WHERE post_title LIKE ?";
          var likeTerm = "%" + searchTerm + "%";
          conn.query(sql, likeTerm, (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing searchPostsByTitle query:", err);
              reject(err);
            } else {
              var posts = result.map(
                (row) =>
                  new Posts(
                    row.post_id,
                    row.poster_id,
                    row.tag_id,
                    row.post_title,
                    row.post_desc,
                    row.image_url,
                    row.comment_count,
                    row.post_upvotes,
                    row.post_downvotes,
                    row.time_created
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
            "SELECT Posts.* FROM Posts INNER JOIN Tags ON Posts.tag_id = Tags.tag_id WHERE Tags.tag_id = ?";
          conn.query(sql, tagId, (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing searchPostsByTag query:", err);
              reject(err);
            } else {
              var posts = result.map(
                (row) =>
                  new Posts(
                    row.post_id,
                    row.poster_id,
                    row.tag_id,
                    row.post_title,
                    row.post_desc,
                    row.image_url,
                    row.comment_count,
                    row.post_upvotes,
                    row.post_downvotes,
                    row.time_created
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
          if (sortBy === "upvotes") {
            sql = "SELECT * FROM Posts ORDER BY post_upvotes DESC";
          } else if (sortBy === "recent") {
            sql = "SELECT * FROM Posts ORDER BY time_created DESC";
          }
          conn.query(sql, (err, result) => {
            conn.end();
            if (err) {
              console.log("Error executing getPostsSorted query:", err);
              reject(err);
            } else {
              var posts = result.map(
                (row) =>
                  new Posts(
                    row.post_id,
                    row.poster_id,
                    row.tag_id,
                    row.post_title,
                    row.post_desc,
                    row.image_url,
                    row.comment_count,
                    row.post_upvotes,
                    row.post_downvotes,
                    row.time_created
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
