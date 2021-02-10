const userQueries = require('./userQueries');
const blogQueries = require('./blogQueries');
const articleQueries = require('./articleQueries');
const commentQueries = require('./commentQueries');
const viewQueries = require('./viewQueries');
const ratingQueries = require('./ratingQueries');
const messageQueries = require('./messageQueries');

const extractQueryResult = require('../utils/extractQueryResult');

module.exports = {
  getUserByCredentialsQuery: userQueries.getUserByCredentialsQuery,
  getUserQuery: userQueries.getUserQuery,
  getBlogByIdQuery: extractQueryResult(blogQueries.getBlogByIdQuery),
  getUserByBlogIdQuery: extractQueryResult(userQueries.getUserByBlogIdQuery),
  getUserListQuery: extractQueryResult(userQueries.getUserListQuery),
  getBlogQuery: extractQueryResult(blogQueries.getBlogQuery),
  getArticleQuery: extractQueryResult(articleQueries.getArticleQuery),
  getArticleListQuery: extractQueryResult(articleQueries.getArticleListQuery),
  getArticleListByBlogIdQuery: extractQueryResult(articleQueries.getArticleListByBlogIdQuery, true),
  getArticleListByAuthorIdQuery: extractQueryResult(articleQueries.getArticleListByAuthorIdQuery, true),
  getBlogListQuery: extractQueryResult(blogQueries.getBlogListQuery),
  getBlogListByAuthorIdQuery: extractQueryResult(blogQueries.getBlogListByAuthorIdQuery, true),
  getCommentListByArticleId: extractQueryResult(commentQueries.getCommentListByArticleId, true),
  getViewCountByArticleId: viewQueries.getViewCountByArticleId,
  getViewCountByBlogId: viewQueries.getViewCountByBlogId,
  getViewCountByUserId: viewQueries.getViewCountByUserId,
  getView: extractQueryResult(viewQueries.getView, true),
  getRatingAverageByArticleId: ratingQueries.getRatingAverageByArticleId,
  getRatingAverageByUserId: ratingQueries.getRatingAverageByUserId,
  getRating: ratingQueries.getRating,
  getRatingAverageByBlogId: ratingQueries.getRatingAverageByBlogId,
  getMessageSendedListByUserId: extractQueryResult(messageQueries.getMessageSendedListByUserId, true),
  getMessageReceivedListByUserId: extractQueryResult(messageQueries.getMessageReceivedListByUserId, true),
}