const db = require("../db/connection");

const fetchArticleById = async (article_id) => {
  try {
    const { rows } = await db.query(
      `SELECT articles.*, 
          COUNT(comments.article_id)::INT AS comment_count 
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id;`,
      [article_id]
    );

    if (!rows[0]) {
      throw {
        status: 404,
        msg: "Article id not found. Please check and try again :)",
      };
    } else if (rows[0]) {
      return rows[0];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateArticle = async (article_id, inc_votes) => {
  try {
    if (!inc_votes) {
      throw { status: 400, msg: "Please include missing fields" };
    }

    const { rows } = await db.query(
      `UPDATE articles 
     SET votes = votes + $1 
     WHERE article_id = $2 
     RETURNING *;`,
      [inc_votes, article_id]
    );

    if (!rows[0]) {
      throw {
        status: 404,
        msg: "Article id not found. Please check and try again :)",
      };
    } else if (rows[0]) {
      return rows[0];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const checkArticleExists = async (article_id) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM articles WHERE article_id = $1;",
      [article_id]
    );
    if (rows.length === 0) {
      throw { status: 404, msg: "Article not found" };
    } else if (rows.length > 0) {
      return rows;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const fetchArticles = async (sort_by = "created_at", order = "desc", topic) => {
  try {
    const validSortByOptions = [
      "article_id",
      "title",
      "topic",
      "author",
      "created_at",
      "votes",
      "comment_count",
    ];
    const validOrders = ["asc", "desc"];
    const validTopics = ["cats", "mitch", "coding", "football", "cooking"];

    if (!validSortByOptions.includes(sort_by)) {
      throw { status: 400, msg: "Invalid sort query" };
    }

    if (!validOrders.includes(order)) {
      throw { status: 400, msg: "Invalid order query" };
    }

    if (!validTopics.includes(topic) && topic !== undefined) {
      throw { status: 400, msg: "Invalid topic query" };
    }

    const topicFilter = topic === undefined ? "" : `WHERE topic = '${topic}'`;

    const { rows } = await db.query(
      `SELECT articles.*, 
      COUNT(comments.article_id)::INT AS comment_count 
      FROM articles
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id   
      ${topicFilter} GROUP BY articles.article_id 
      ORDER BY ${sort_by} ${order};`
    );

    return { articles: rows };
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  fetchArticleById,
  updateArticle,
  checkArticleExists,
  fetchArticles,
};
