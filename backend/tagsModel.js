var db = require("./config/databaseConfig.js");
var Tag = require("./tags");

var tagFunctions = {
  // Function to get all tags using Promises
  getAllTags: async function () {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = "SELECT * FROM Tags";
      const [result] = await conn.query(sql);
      const tags = result.map((row) => new Tag(row.tag_id, row.tag_name));
      return tags;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  // Function to create a new tag
  createTag: async function (tagName) {
    var conn;
    try {
      conn = await db.getConnection();
      const sql = "INSERT INTO Tags (tag_name) VALUES (?)";
      const [result] = await conn.query(sql, [tagName]);
      if (result.insertId) {
        return new Tag(result.insertId, tagName);
      } else {
        throw new Error("Tag creation failed");
      }
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },
};
module.exports = tagFunctions;
