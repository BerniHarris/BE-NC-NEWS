const db = require("../db/connection");
const topics = require("../db/data/test-data/topics");

const fetchCommentsByArticleId = (article_id) => {
  const queryText = `
    SELECT comment_id, votes, created_at, author, body
    FROM comments
    WHERE article_id = $1;
  `;
  return db.query(queryText, [article_id]).then(({ rows }) => rows);
};

const addCommentToArticleId = async (articleId, { username: author, body }) => {
  const { rows } = await db.query(
    `INSERT INTO comments (article_id, author, body)
     VALUES ($1, $2, $3)
     RETURNING *;`,
    [articleId, author, body]
  );
  return rows[0];
};

const deleteComment = async (comment_id) => {
  const { rows } = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
    [comment_id]
  );
  return rows[0];
};

const checkCommentExists = async (comment_id) => {
  const { rows } = await db.query(
    "SELECT * FROM comments WHERE comment_id = $1;",
    [comment_id]
  );
  if (!rows.length) {
    throw { status: 404, msg: "Comment not found" };
  }
  return rows;
};

module.exports = {
  fetchCommentsByArticleId,
  addCommentToArticleId,
  deleteComment,
  checkCommentExists,
};
