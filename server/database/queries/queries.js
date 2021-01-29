const userQueries = require('./userQueries');
const blogQueries = require('./blogQueries');
const articleQueries = require('./articleQueries');

function extractQueryResult(query, isList = false) {
  return (...args) => new Promise((resolve, reject) => {
    query(...args)
      .then((queryResult) => {
        let temp = queryResult;
        while (Array.isArray(temp[0])) {
          temp = temp[0];
        }
        
        const result = temp.length === 1 && !isList ?
          temp[0] :
          temp;
        
        resolve(result);
      })
      .catch((err) => reject(err));
  });
}

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
  createUserMutation: extractQueryResult(userQueries.createUserMutation),
  updateUserMutation: extractQueryResult(userQueries.updateUserMutation),
  deleteUserMutation: extractQueryResult(userQueries.deleteUserMutation),
}