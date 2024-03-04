const db = require("../db/connection");
const topics = require("../db/data/test-data/topics");

const fetchTopics = async () => {
  const { rows } = await db.query("SELECT * FROM topics;");
  return { topics: rows };
};

module.exports = {
  fetchTopics,
};
