const moduleDB = require("./db.config");

const pgp = require("pg-promise")({
  query(e) {
    // console.log(e.query);
  },
});
const pgDB = pgp(moduleDB.urlPgDB);
pgDB
  .connect()
  .then((obj) => {
    const serverVersion = obj.client.serverVersion;
    // console.log("Connected pg successfully")
    obj.done(); // success, release the connection;
  })
  .catch((error) => {
    // console.log('ERROR:', error.message || error);
    process.exit();
  });

module.exports.pgDB = pgDB;
