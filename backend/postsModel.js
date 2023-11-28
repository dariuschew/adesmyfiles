var db = require("./config/databaseConfig.js");
var Posts = require("./posts");

var postFunctions = {
  // Function to get all posts with pagination [SEQUENTIAL]
  getAllPosts: async function (page, limit, sortBy) {
    var conn;
    try {
      console.log(`getAllPosts called with page: ${page}, limit: ${limit}`);
      conn = await db.getConnection();
      console.log("Database connection established");

      const offset = (page - 1) * limit;
      console.log(`Calculated offset: ${offset}`);

      const countSql = `SELECT COUNT(*) AS total FROM Posts`;
      console.log(`Count SQL: ${countSql}`);

      let orderByClause = "";
      if (sortBy === "upvotes") {
        orderByClause = "ORDER BY (post_upvotes - post_downvotes) DESC";
      } else if (sortBy === "recent") {
        orderByClause = "ORDER BY time_created DESC";
      }

      const sql = `SELECT * FROM Posts ${orderByClause} LIMIT ? OFFSET ?`;
      console.log(`Posts SQL: ${sql}`);
      console.log(`Executing query with limit: ${limit} and offset: ${offset}`);

      const [postsResult, countResult] = await Promise.all([
        conn.query(sql, [limit, offset]),
        conn.query(countSql),
      ]);

      console.log(`Received postsResult with length: ${postsResult[0].length}`);
      console.log(`Received countResult: ${JSON.stringify(countResult[0])}`);

      let posts = [];

      for (const postRow of postsResult[0]) {
        console.log(`Processing post with ID: ${postRow.post_id}`);

        let imageUrl = null;
        if (postRow.image_id) {
          const imageSql = `SELECT image_url FROM Images WHERE image_id = ?`;
          console.log(`Fetching image with ID: ${postRow.image_id}`);
          const [imageResult] = await conn.query(imageSql, [postRow.image_id]);
          imageUrl = imageResult[0]?.image_url;
          console.log(`Fetched image URL: ${imageUrl}`);
        }

        let tagName = null;
        if (postRow.tag_id) {
          const tagSql = `SELECT tag_name FROM Tags WHERE tag_id = ?`;
          console.log(`Fetching tag with ID: ${postRow.tag_id}`);
          const [tagResult] = await conn.query(tagSql, [postRow.tag_id]);
          tagName = tagResult[0]?.tag_name;
          console.log(`Fetched tag name: ${tagName}`);
        }

        let full_name,
          username,
          email,
          user_class,
          date_of_birth,
          user_image_url = null;
        if (postRow.poster_id) {
          const userSql = `SELECT full_name, username, email, class, date_of_birth, image_id FROM Users WHERE user_id = ?`;
          console.log(
            `Fetching user details for user ID: ${postRow.poster_id}`
          );
          const [userResult] = await conn.query(userSql, [postRow.poster_id]);
          const userRow = userResult[0];
          console.log(`Fetched user result: ${JSON.stringify(userRow)}`);

          full_name = userRow.full_name;
          username = userRow.username;
          email = userRow.email;
          user_class = userRow.class;
          date_of_birth = userRow.date_of_birth;

          if (userRow.image_id) {
            const userImageSql = `SELECT image_url FROM Images WHERE image_id = ?`;
            console.log(`Fetching user image with ID: ${userRow.image_id}`);
            const [userImageResult] = await conn.query(userImageSql, [
              userRow.image_id,
            ]);
            user_image_url = userImageResult[0]?.image_url;
            console.log(`Fetched user image URL: ${user_image_url}`);
          }
        }

        const post = new Posts(
          postRow.post_id,
          postRow.post_title,
          postRow.post_desc,
          imageUrl,
          postRow.comment_count,
          postRow.post_upvotes,
          postRow.post_downvotes,
          postRow.time_created,
          tagName,
          full_name,
          username,
          email,
          user_class,
          date_of_birth,
          user_image_url
        );

        console.log(`Created post object: ${JSON.stringify(post)}`);
        posts.push(post);
      }

      console.log(`Processed posts: ${JSON.stringify(posts)}`);

      const total = countResult[0][0].total;
      console.log(`Total posts count: ${total}`);

      return { total, posts };
    } catch (error) {
      console.error("Error executing getAllPosts query:", error);
      throw error;
    } finally {
      if (conn) {
        console.log("Releasing database connection...");
        conn.release();
      }
    }
  },

  // getAllPosts: async function (page, limit) {
  //   var conn;
  //   try {
  //     console.log(`getAllPosts called with page: ${page}, limit: ${limit}`);
  //     conn = await db.getConnection();
  //     const offset = (page - 1) * limit;
  //     console.log(`Calculated offset: ${offset}`);

  //     const countSql = `SELECT COUNT(*) AS total FROM Posts`;
  //     console.log(`Count SQL: ${countSql}`);

  //     const sql = `
  // SELECT Posts.*, Images.image_url, Tags.tag_name,
  // Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth,
  // UserImages.image_url AS user_image_url
  // FROM Posts
  // LEFT JOIN Images ON Posts.image_id = Images.image_id
  // LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id
  // LEFT JOIN Users ON Posts.poster_id = Users.user_id
  // LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id
  // LIMIT ? OFFSET ?`;
  //     console.log(`Posts SQL: ${sql}`);

  //     console.log("Executing database queries...");
  //     const [postsResult, countResult] = await Promise.all([
  //       conn.query(sql, [limit, offset]),
  //       conn.query(countSql),
  //     ]);

  //     console.log(`Received postsResult with length: ${postsResult[0].length}`);
  //     console.log(`Received countResult: ${JSON.stringify(countResult[0])}`);

  //     const posts = postsResult[0].map((row) => {
  //       console.log(`Mapping post with ID: ${row.post_id}`);
  //       return new Posts(
  //         row.post_id,
  //         row.post_title,
  //         row.post_desc,
  //         row.image_url,
  //         row.comment_count,
  //         row.post_upvotes,
  //         row.post_downvotes,
  //         row.time_created,
  //         row.tag_name,
  //         row.full_name,
  //         row.username,
  //         row.email,
  //         row.class,
  //         row.date_of_birth,
  //         row.user_image_url
  //       );
  //     });
  //     console.log(`Mapped posts: ${JSON.stringify(posts)}`);

  //     const total = countResult[0][0].total;
  //     console.log(`Total posts count: ${total}`);

  //     return { total, posts };
  //   } catch (error) {
  //     console.error("Error executing getAllPosts query:", error);
  //     throw error;
  //   } finally {
  //     if (conn) {
  //       console.log("Releasing database connection...");
  //       conn.release();
  //     }
  //   }
  // },

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

  // Function to get sorted and paginated posts
  getPostsSorted: async function (sortBy, limit, offset) {
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
      LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id`;

      var orderByClause = "";
      if (sortBy === "upvotes") {
        orderByClause =
          "ORDER BY (Posts.post_upvotes)-(Posts.post_downvotes) DESC";
      } else if (sortBy === "recent") {
        orderByClause = "ORDER BY Posts.time_created DESC";
      }

      var paginationClause = ` LIMIT ? OFFSET ?`;
      var sql = `${baseSql} ${orderByClause} ${paginationClause}`;

      // Prepare both queries
      const postsQuery = conn.query(sql, [limit, offset]);
      const totalQuery = conn.query(`SELECT COUNT(*) AS total FROM Posts`);

      // Execute both queries concurrently
      const [[postsResult], [totalResult]] = await Promise.all([
        postsQuery,
        totalQuery,
      ]);

      const posts = postsResult.map(
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

      const total = totalResult[0].total;
      return { total, posts };
    } catch (error) {
      console.error("Error executing getPostsSorted query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to search and sort posts [SEQUENTIAL]
  searchAndSortPosts: async function (
    searchTerm,
    sortBy,
    limit,
    offset,
    searchType
  ) {
    var conn;
    try {
      conn = await db.getConnection();
      var baseSql = `SELECT * FROM Posts`;
      var searchClause = "";
      if (searchTerm) {
        if (searchType === "tag") {
          baseSql += " INNER JOIN Tags ON Posts.tag_id = Tags.tag_id";
          searchClause = " WHERE Tags.tag_name LIKE ?";
        } else if (searchType === "title") {
          searchClause = " WHERE post_title LIKE ?";
        } else {
          searchClause = " WHERE post_title LIKE ?";
        }
      }

      var sortClause = "";
      if (sortBy === "upvotes") {
        sortClause = " ORDER BY (post_upvotes - post_downvotes) DESC";
      } else if (sortBy === "recent") {
        sortClause = " ORDER BY time_created DESC";
      }

      var paginationClause = ` LIMIT ? OFFSET ?`;
      var sql = baseSql + searchClause + sortClause + paginationClause;

      const queryParams = searchTerm
        ? ["%" + searchTerm + "%", limit, offset]
        : [limit, offset];

      // Execute the base posts query
      const [postsResult] = await conn.query(sql, queryParams);

      let posts = [];
      for (const postRow of postsResult) {
        let image_url,
          tag_name,
          full_name,
          username,
          email,
          user_class,
          date_of_birth,
          user_image_url;

        // Fetch post image
        if (postRow.image_id) {
          const imageSql = `SELECT image_url FROM Images WHERE image_id = ?`;
          const [imageResult] = await conn.query(imageSql, [postRow.image_id]);
          image_url = imageResult[0]?.image_url;
        }

        // Fetch tag name if searchType is 'tag'
        if (searchType === "tag" && searchTerm) {
          const tagSql = `SELECT tag_name FROM Tags WHERE tag_name LIKE ?`;
          const [tagResult] = await conn.query(tagSql, [
            "%" + searchTerm + "%",
          ]);
          tag_name = tagResult[0]?.tag_name;
          // If the tag name doesn't match the searchTerm, skip this post
          if (!tag_name) continue;
        } else if (postRow.tag_id) {
          const tagSql = `SELECT tag_name FROM Tags WHERE tag_id = ?`;
          const [tagResult] = await conn.query(tagSql, [postRow.tag_id]);
          tag_name = tagResult[0]?.tag_name;
        }

        // Fetch user details
        if (postRow.poster_id) {
          const userSql = `SELECT full_name, username, email, class AS user_class, date_of_birth, image_id FROM Users WHERE user_id = ?`;
          const [userResult] = await conn.query(userSql, [postRow.poster_id]);
          const userRow = userResult[0] || {};
          full_name = userRow.full_name;
          username = userRow.username;
          email = userRow.email;
          user_class = userRow.user_class;
          date_of_birth = userRow.date_of_birth;

          // Fetch user image
          if (userRow.image_id) {
            const userImageSql = `SELECT image_url FROM Images WHERE image_id = ?`;
            const [userImageResult] = await conn.query(userImageSql, [
              userRow.image_id,
            ]);
            user_image_url = userImageResult[0]?.image_url;
          }
        }

        // Assemble the post object
        const post = new Posts(
          postRow.post_id,
          postRow.post_title,
          postRow.post_desc,
          image_url,
          postRow.comment_count,
          postRow.post_upvotes,
          postRow.post_downvotes,
          postRow.time_created,
          tag_name,
          full_name,
          username,
          email,
          user_class,
          date_of_birth,
          user_image_url
        );

        posts.push(post);
      }

      // Calculate the total count if needed
      let total = 0;
      if (searchType !== "tag" || !searchTerm) {
        const totalSql = `SELECT COUNT(*) AS total FROM Posts ${searchClause}`;
        const totalParams = searchTerm ? ["%" + searchTerm + "%"] : [];
        const [totalResult] = await conn.query(totalSql, totalParams);
        total = totalResult[0]?.total;
      } else {
        // If searching by tag, total is the length of the posts array
        total = posts.length;
      }

      return { total, posts };
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

  // Function to increment comment count of a post
  incrementCommentCount: async function (postId) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql =
        "UPDATE Posts SET comment_count = comment_count + 1 WHERE post_id = ?";
      await conn.query(sql, [postId]);
    } catch (error) {
      console.error("Error executing incrementCommentCount query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to decrement comment count of a post
  decrementCommentCount: async function (postId) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql =
        "UPDATE Posts SET comment_count = comment_count - 1 WHERE post_id = ?";
      await conn.query(sql, [postId]);
    } catch (error) {
      console.error("Error executing decrementCommentCount query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to get the top 3 contributors
  getTopContributors: async function () {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = `
      SELECT 
      u.user_id,
      u.full_name,
      u.email,
      COALESCE(p.post_count, 0) AS post_count,
      COALESCE(c.comment_count, 0) AS comment_count,
      COALESCE(up.upvote_count, 0) AS upvote_count,
      COALESCE(down.downvote_count, 0) AS downvote_count
  FROM 
      Users u
  LEFT JOIN (
      SELECT 
          poster_id, 
          COUNT(*) AS post_count,
          SUM(post_upvotes) AS upvote_count,
          SUM(post_downvotes) AS downvote_count
      FROM Posts
      GROUP BY poster_id
  ) p ON u.user_id = p.poster_id
  LEFT JOIN (
      SELECT 
          user_id, 
          COUNT(*) AS comment_count
      FROM Comments
      GROUP BY user_id
  ) c ON u.user_id = c.user_id
  LEFT JOIN (
      SELECT 
          poster_id, 
          SUM(post_upvotes) AS upvote_count
      FROM Posts
      GROUP BY poster_id
  ) up ON u.user_id = up.poster_id
  LEFT JOIN (
      SELECT 
          poster_id, 
          SUM(post_downvotes) AS downvote_count
      FROM Posts
      GROUP BY poster_id
  ) down ON u.user_id = down.poster_id
  ORDER BY (COALESCE(p.post_count, 0) + COALESCE(c.comment_count, 0)) DESC
  LIMIT 3;
  `;
      const [result] = await conn.query(sql);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },
};

//TESTING FUNCTIONS LOL (IGNORE)
// Function to get all posts with pagination [SEQUENTIAL]
// getAllPosts: async function (page, limit) {
//   var conn;
//   try {
//     console.log(`getAllPosts called with page: ${page}, limit: ${limit}`);
//     conn = await db.getConnection();
//     const offset = (page - 1) * limit;
//     console.log(`Calculated offset: ${offset}`);

//     const countSql = `SELECT COUNT(*) AS total FROM Posts`;
//     console.log(`Count SQL: ${countSql}`);

//     const sql = `
//   SELECT Posts.*, Images.image_url, Tags.tag_name,
//   Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth,
//   UserImages.image_url AS user_image_url
//   FROM Posts
//   LEFT JOIN Images ON Posts.image_id = Images.image_id
//   LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id
//   LEFT JOIN Users ON Posts.poster_id = Users.user_id
//   LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id
//   LIMIT ? OFFSET ?`;
//     console.log(`Posts SQL: ${sql}`);

//     console.log("Executing database queries...");
//     const [postsResult, countResult] = await Promise.all([
//       conn.query(sql, [limit, offset]),
//       conn.query(countSql),
//     ]);

//     console.log(`Received postsResult with length: ${postsResult[0].length}`);
//     console.log(`Received countResult: ${JSON.stringify(countResult[0])}`);

//     const posts = postsResult[0].map((row) => {
//       console.log(`Mapping post with ID: ${row.post_id}`);
//       return new Posts(
//         row.post_id,
//         row.post_title,
//         row.post_desc,
//         row.image_url,
//         row.comment_count,
//         row.post_upvotes,
//         row.post_downvotes,
//         row.time_created,
//         row.tag_name,
//         row.full_name,
//         row.username,
//         row.email,
//         row.class,
//         row.date_of_birth,
//         row.user_image_url
//       );
//     });
//     console.log(`Mapped posts: ${JSON.stringify(posts)}`);

//     const total = countResult[0][0].total;
//     console.log(`Total posts count: ${total}`);

//     return { total, posts };
//   } catch (error) {
//     console.error("Error executing getAllPosts query:", error);
//     throw error;
//   } finally {
//     if (conn) {
//       console.log("Releasing database connection...");
//       conn.release();
//     }
//   }
// },

// Function to search posts by title
// searchPostsByTitle: async function (searchTerm) {
//   var conn;
//   try {
//     conn = await db.getConnection();
//     const sql = `SELECT Posts.*, Images.image_url, Tags.tag_name, Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth, UserImages.image_url AS user_image_url FROM Posts LEFT JOIN Images ON Posts.image_id = Images.image_id LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id LEFT JOIN Users ON Posts.poster_id = Users.user_id LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id WHERE Posts.post_title LIKE ?`;
//     const likeTerm = "%" + searchTerm + "%";
//     const [result] = await conn.query(sql, likeTerm);
//     const posts = result.map(
//       (row) =>
//         new Posts(
//           row.post_id,
//           row.post_title,
//           row.post_desc,
//           row.image_url,
//           row.comment_count,
//           row.post_upvotes,
//           row.post_downvotes,
//           row.time_created,
//           row.tag_name,
//           row.full_name,
//           row.username,
//           row.email,
//           row.class,
//           row.date_of_birth,
//           row.user_image_url
//         )
//     );
//     return posts;
//   } catch (error) {
//     console.error("Error executing searchPostsByTitle query:", error);
//     throw error;
//   } finally {
//     if (conn) conn.release();
//   }
// },

// Function to search posts by tag ID
// searchPostsByTag: async function (tagName) {
//   var conn;
//   try {
//     conn = await db.getConnection();
//     const sql = `
//       SELECT Posts.*, Images.image_url, Tags.tag_name,
//       Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth,
//       UserImages.image_url AS user_image_url
//       FROM Posts
//       LEFT JOIN Images ON Posts.image_id = Images.image_id
//       INNER JOIN Tags ON Posts.tag_id = Tags.tag_id
//       LEFT JOIN Users ON Posts.poster_id = Users.user_id
//       LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id
//       WHERE Tags.tag_name = ?`;
//     const [result] = await conn.query(sql, [tagName]);
//     const posts = result.map(
//       (row) =>
//         new Posts(
//           row.post_id,
//           row.post_title,
//           row.post_desc,
//           row.image_url,
//           row.comment_count,
//           row.post_upvotes,
//           row.post_downvotes,
//           row.time_created,
//           row.tag_name,
//           row.full_name,
//           row.username,
//           row.email,
//           row.class,
//           row.date_of_birth,
//           row.user_image_url
//         )
//     );
//     return posts;
//   } catch (error) {
//     console.error("Error executing searchPostsByTag query:", error);
//     throw error;
//   } finally {
//     if (conn) conn.release();
//   }
// },

// Function to search and sort posts
// searchAndSortPosts: async function (searchTerm, sortBy, limit, offset) {
//   var conn;
//   try {
//     conn = await db.getConnection();
//     var baseSql = `
//       SELECT Posts.*, Images.image_url, Tags.tag_name,
//       Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth,
//       UserImages.image_url AS user_image_url
//       FROM Posts
//       LEFT JOIN Images ON Posts.image_id = Images.image_id
//       LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id
//       LEFT JOIN Users ON Posts.poster_id = Users.user_id
//       LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id `;

//     var searchClause = searchTerm ? "WHERE Posts.post_title LIKE ? " : "";
//     var sortClause = "";
//     if (sortBy === "upvotes") {
//       sortClause =
//         "ORDER BY (Posts.post_upvotes)-(Posts.post_downvotes) DESC";
//     } else if (sortBy === "recent") {
//       sortClause = "ORDER BY Posts.time_created DESC";
//     }

//     var paginationClause = ` LIMIT ? OFFSET ?`;
//     var sql = baseSql + searchClause + sortClause + paginationClause;

//     const queryParams = searchTerm
//       ? ["%" + searchTerm + "%", limit, offset]
//       : [limit, offset];

//     // Prepare queries for execution
//     const postsQuery = conn.query(sql, queryParams);
//     const totalSql = `SELECT COUNT(*) AS total FROM Posts ${searchClause}`;
//     const totalQuery = conn.query(
//       totalSql,
//       searchTerm ? ["%" + searchTerm + "%"] : []
//     );

//     // Execute both queries concurrently
//     const [[postsResult], [totalResult]] = await Promise.all([
//       postsQuery,
//       totalQuery,
//     ]);

//     const posts = postsResult.map(
//       (row) =>
//         new Posts(
//           row.post_id,
//           row.post_title,
//           row.post_desc,
//           row.image_url,
//           row.comment_count,
//           row.post_upvotes,
//           row.post_downvotes,
//           row.time_created,
//           row.tag_name,
//           row.full_name,
//           row.username,
//           row.email,
//           row.class,
//           row.date_of_birth,
//           row.user_image_url
//         )
//     );
//     const total = totalResult[0].total;
//     return { total, posts };
//   } catch (error) {
//     console.error("Error executing searchAndSortPosts query:", error);
//     throw error;
//   } finally {
//     if (conn) conn.release();
//   }
// },

// searchAndSortPosts: async function (
//   searchTerm,
//   sortBy,
//   limit,
//   offset,
//   searchType
// ) {
//   var conn;
//   try {
//     conn = await db.getConnection();
//     var baseSql = `
//     SELECT Posts.*, Images.image_url, Tags.tag_name,
//     Users.full_name, Users.username, Users.email, Users.class, Users.date_of_birth,
//     UserImages.image_url AS user_image_url
//     FROM Posts
//     LEFT JOIN Images ON Posts.image_id = Images.image_id
//     LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id
//     LEFT JOIN Users ON Posts.poster_id = Users.user_id
//     LEFT JOIN Images AS UserImages ON Users.image_id = UserImages.image_id`;

//     var searchClause = "";
//     if (searchTerm) {
//       if (searchType === "tag") {
//         searchClause = " WHERE Tags.tag_name LIKE ? ";
//       } else if (searchType === "title") {
//         searchClause = " WHERE Posts.post_title LIKE ? ";
//       } else {
//         searchClause =
//           " WHERE Posts.post_title LIKE ? OR Tags.tag_name LIKE ? ";
//       }
//     }

//     var sortClause = "";
//     if (sortBy === "upvotes") {
//       sortClause =
//         " ORDER BY (Posts.post_upvotes)-(Posts.post_downvotes) DESC";
//     } else if (sortBy === "recent") {
//       sortClause = " ORDER BY Posts.time_created DESC";
//     }

//     var paginationClause = ` LIMIT ? OFFSET ?`;
//     var sql = baseSql + searchClause + sortClause + paginationClause;

//     const queryParams = searchTerm
//       ? searchType === "tag" || searchType === "title"
//         ? ["%" + searchTerm + "%", limit, offset]
//         : ["%" + searchTerm + "%", "%" + searchTerm + "%", limit, offset]
//       : [limit, offset];

//     // Prepare queries for execution
//     const postsQuery = conn.query(sql, queryParams);
//     const totalSql = `SELECT COUNT(*) AS total FROM Posts LEFT JOIN Tags ON Posts.tag_id = Tags.tag_id ${searchClause}`;
//     const totalQuery = conn.query(
//       totalSql,
//       searchTerm ? ["%" + searchTerm + "%", "%" + searchTerm + "%"] : []
//     );

//     // Execute both queries concurrently
//     const [[postsResult], [totalResult]] = await Promise.all([
//       postsQuery,
//       totalQuery,
//     ]);

//     const posts = postsResult.map(
//       (row) =>
//         new Posts(
//           row.post_id,
//           row.post_title,
//           row.post_desc,
//           row.image_url,
//           row.comment_count,
//           row.post_upvotes,
//           row.post_downvotes,
//           row.time_created,
//           row.tag_name,
//           row.full_name,
//           row.username,
//           row.email,
//           row.class,
//           row.date_of_birth,
//           row.user_image_url
//         )
//     );
//     const total = totalResult[0].total;
//     return { total, posts };
//   } catch (error) {
//     console.error("Error executing searchAndSortPosts query:", error);
//     throw error;
//   } finally {
//     if (conn) conn.release();
//   }
// },
module.exports = postFunctions;
