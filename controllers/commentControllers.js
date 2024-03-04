const {
  fetchCommentsByArticleId,
  addCommentToArticleId,
  checkCommentExists,
} = require("../models/commentModels");
const { checkArticleExists } = require("../models/articleModels");
const { deleteComment } = require("../models/commentModels");

const getArticleComments = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    await checkArticleExists(article_id);
    const comments = await fetchCommentsByArticleId(article_id);
    res.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
};

const postCommentToArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const userComment = req.body;
  try {
    const comment = await addCommentToArticleId(article_id, userComment);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

const deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  try {
    await checkCommentExists(comment_id);
    await deleteComment(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getArticleComments,
  postCommentToArticleId,
  deleteCommentById,
};
