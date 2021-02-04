const userMutations = require('./userMutations');
const blogMutations = require('./blogMutations');
const articleMutations = require('./articleMutations');
const commentMutations = require('./commentMutations');
const viewMutations = require('./viewMutations');
const ratingMutations = require('./ratingMutations');
const messageMutations = require('./messageMutations');

const extractQueryResult = require('../utils/extractQueryResult');

module.exports = {
  createUserMutation: extractQueryResult(userMutations.createUserMutation),
  updateUserMutation: extractQueryResult(userMutations.updateUserMutation),
  deleteUserMutation: extractQueryResult(userMutations.deleteUserMutation),
  articleCreateMutation: extractQueryResult(articleMutations.articleCreateMutation),
  articleDeleteMutation: extractQueryResult(articleMutations.articleDeleteMutation),
  articleUpdateMutation: extractQueryResult(articleMutations.articleUpdateMutation),
  commentCreateMutation: extractQueryResult(commentMutations.commentCreateMutation),
  commentDeleteMutation: extractQueryResult(commentMutations.commentDeleteMutation),
  commentUpdateMutation: extractQueryResult(commentMutations.commentUpdateMutation),
  blogCreateMutation: extractQueryResult(blogMutations.blogCreateMutation),
  blogDeleteMutation: extractQueryResult(blogMutations.blogDeleteMutation),
  blogUpdateMutation: extractQueryResult(blogMutations.blogUpdateMutation),
  messageCreateMutation: extractQueryResult(messageMutations.messageCreateMutation),
  markMessageAsDeletedMutation: extractQueryResult(messageMutations.markMessageAsDeletedMutation),
  markMessageAsArchivedMutation: extractQueryResult(messageMutations.markMessageAsArchivedMutation),
  markMessageAsReadedMutation: extractQueryResult(messageMutations.markMessageAsReadedMutation),
  restoreMessageMutation: extractQueryResult(messageMutations.restoreMessageMutation),
  ratingDeleteMutation: extractQueryResult(ratingMutations.ratingDeleteMutation),
  ratingUpdateMutation: extractQueryResult(ratingMutations.ratingUpdateMutation),
  ratingCreateMutation: extractQueryResult(ratingMutations.ratingCreateMutation),
  viewDeleteMutation: extractQueryResult(viewMutations.viewDeleteMutation),
  viewUpdateMutation: extractQueryResult(viewMutations.viewUpdateMutation),
  viewCreateMutation: extractQueryResult(viewMutations.viewCreateMutation),
}