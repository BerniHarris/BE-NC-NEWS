const { fetchTopics } = require("../models/topicModels");

const getTopics = async (req, res, next) => {
  try {
    const topics = await fetchTopics();
    res.status(200).send(topics);
  } catch (err) {
    next(err);
  }
};

module.exports = { getTopics };
