const userMutations = require('./userMutations');
const blogMutations = require('./blogMutations');
const articleMutations = require('./articleMutations');
const commentMutations = require('./commentMutations');
const viewMutations = require('./viewMutations');
const ratingMutations = require('./ratingMutations');
const messageMutations = require('./messageMutations');

const extractQueryResult = require('../utils/extractQueryResult');

module.exports = {
  userCreateMutation: extractQueryResult(userMutations.userCreateMutation),
  userUpdateMutation: extractQueryResult(userMutations.userUpdateMutation),
  userDeleteMutation: extractQueryResult(userMutations.userDeleteMutation),
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
  messageUpdateMutation: extractQueryResult(messageMutations.messageUpdateMutation),
  ratingDeleteMutation: extractQueryResult(ratingMutations.ratingDeleteMutation),
  ratingUpdateMutation: extractQueryResult(ratingMutations.ratingUpdateMutation),
  ratingCreateMutation: extractQueryResult(ratingMutations.ratingCreateMutation),
  viewUpdateMutation: extractQueryResult(viewMutations.viewUpdateMutation),
  viewCreateMutation: extractQueryResult(viewMutations.viewCreateMutation),
}