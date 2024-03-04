const {
  fetchArticleById,
  updateArticle,
  fetchArticles,
  checkArticleExists,
} = require("../models/articleModels");

const { fetchCommentsByArticleId } = require("../models/commentModels");

const getArticleById = async (req, res, next) => {
  const { article_id: articleId } = req.params;
  try {
    const article = await fetchArticleById(articleId);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

const patchArticle = async (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  try {
    const article = await updateArticle(article_id, inc_votes);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

const getArticles = async (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  try {
    const articles = await fetchArticles(sort_by, order, topic);
    res.status(200).send(articles);
  } catch (err) {
    next(err);
  }
};

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

module.exports = {
  getArticleById,
  patchArticle,
  getArticles,
  getArticleComments,
};
