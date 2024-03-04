const db = require("../db/connection");

const fetchUserNames = async () => {
  const { rows } = await db.query("SELECT username FROM users;");
  return rows;
};

module.exports = {
  fetchUserNames,
};
