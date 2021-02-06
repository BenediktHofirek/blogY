const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');

const {
	UserType,
	BlogType,
  ArticleType,
  AuthType,
	ArticleListType,
	BlogListType,
	UserListType,
  MessageType,
} = require('./types');

const {
  getUserByCredentialsQuery,
  getUserQuery,
  getBlogByIdQuery,
  getUserByBlogIdQuery,
  getUserListQuery,
  getBlogQuery,
  getArticleQuery,
  getArticleListQuery,
  getArticleListByBlogIdQuery,
  getArticleListByAuthorIdQuery,
  getBlogListQuery,
  getBlogListByAuthorIdQuery,
  getCommentListByArticleId,
  getViewCountByArticleId,
  getRatingAverageByArticleId,
  getRating,
  getMessageSendedListByUserId,
  getMessageReceivedListByUserId,
} = require('../database/queries/queries.js');

const {
  generatePasswordHash,
  validatePassword,
  issueJWT,
} = require('../auth/utils.js');

const { errorMap } = require('./errors.js');

module.exports = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
    messageList: {
      type: new GraphQLList(MessageType),
			resolve: async function (parent, args) {
        const [messageSendedList, messageReceivedList] = Promise.all([
          getMessageSendedListByUserId(args.user.id),          
          getMessageReceivedListByUserId(args.user.id),          
        ]);

        return {
          messageSendedList,
          messageReceivedList
        }
			}
		},
    articleList: {
      type: ArticleListType,
      args: {
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        filter: { type: GraphQLString },
        sortBy: { type: GraphQLString },
        orderBy: { type: GraphQLString },
        timeframe: { type: GraphQLInt },
        blogId: { type: GraphQLID },
			},
			resolve(parent, args) {
        return getArticleListQuery(args);
			}
		},
		blogList: {
      type: BlogListType,
      args: {
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        filter: { type: GraphQLString },
        sortBy: { type: GraphQLString },
        orderBy: { type: GraphQLString },
        timeframe: { type: GraphQLInt },
        userId: { type: GraphQLID },
			},
			resolve(parent, args) {
        return getBlogListQuery(args);
			}
		},
		userList: {
      type: UserListType,
      args: {
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        filter: { type: GraphQLString },
        sortBy: { type: GraphQLString },
        orderBy: { type: GraphQLString },
        timeframe: { type: GraphQLInt },
			},
			resolve(parent, args) {
        return getUserListQuery(args);
			}
		},
    article: {
      type: ArticleType,
      args: {
        articleName: { type: new GraphQLNonNull(GraphQLString) },
        blogName: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
      },
			resolve(parent, args) {
        return getArticleQuery(args);
			}
    },
    blog: {
      type: BlogType,
      args: {
        blogName: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
      },
			resolve(parent, args) {
        return getBlogQuery(args);
			}
    },
    user: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
			resolve(parent, args) {
        if(!args.userId && !args.username) {
          throw new Error('Specify userId or username');
        }
        return getUserQuery(args);
			}
    },
    login: {
      type: AuthType,
      args: {
        usernameOrEmail: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
			resolve(parent, { usernameOrEmail, password }, context) {
        return new Promise((resolve, reject) => {
          getUserByCredentialsQuery(usernameOrEmail)
            .then((user) => {
              console.log(user);
              if (!user) {
                reject(errorMap.USER_NOT_FOUND);
              }else if (validatePassword(password, user.password)) {
                const token = issueJWT(user.id, '1d');
                resolve({ 
                  token,
                  user,
                });
              } else {
                reject(errorMap.WRONG_PASSWORD);
              }
            }).catch((err) => { reject(errorMap.USER_NOT_FOUND); });
        });
			}
		}
	}
});