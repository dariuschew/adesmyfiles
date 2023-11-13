var db = require("./config/databaseConfig.js");
var Tag = require("./tags");

var tagFunctions = {
  // Function to get all tags using Promises
  getAllTags: function () {
    return new Promise((resolve, reject) => {
      var conn = db.getConnection();
      conn.connect(function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var sql = "SELECT * FROM Tags";
          conn.query(sql, function (err, result) {
            conn.end();
            if (err) {
              console.log(err);
              reject(err);
            } else {
              var tags = result.map(function (row) {
                return new Tag(row.tag_id, row.tag_name);
              });
              resolve(tags);
            }
          });
        }
      });
    });
  },
};

module.exports = tagFunctions;
