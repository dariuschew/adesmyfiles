var db = require("./config/databaseConfig.js");

var tagFunctions = {
  // Function to get all comments
  getAllTags: function (callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql = "SELECT * FROM Tags";
        conn.query(sql, function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  },
};

module.exports = tagFunctions;
