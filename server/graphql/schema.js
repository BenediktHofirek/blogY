const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const {
  getBlogListQuery,
  getBlogByIdQuery,
  getUserListQuery,
  getArticleListQuery,
  getArticleListByAuthorQuery,
  getUserByIdQuery,
  getUserByCredentialsQuery,
  getUserByBlogIdQuery,
  createUserMutation,
  updateUserMutation,
  deleteUserMutation,
} = require('../database/queries/queries.js');
const {
  generatePasswordHash,
  validatePassword,
  issueJWT,
} = require('../auth/utils.js');
const { errorMap } = require('./errors.js');

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: GraphQLID },
		username: { type: GraphQLString },
		email: { type: GraphQLString },
		description: { type: GraphQLString },
		photoUrl: { type: GraphQLString },
		createdAt: { type: GraphQLString },
		updatedAt: { type: GraphQLString },
		blogList: {
			type: new GraphQLList(BlogType),
			resolve(parent) {
				return getBlogListQuery(parent.id);
			}
    },
    articleList: {
			type: new GraphQLList(ArticleType),
			resolve(parent) {
				return getArticleListByAuthorQuery(parent.id);
			}
    },
	})
});

const BlogType = new GraphQLObjectType({
	name: 'Blog',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		authorId: { type: GraphQLID },
		createdAt: { type: GraphQLString },
		updatedAt: { type: GraphQLString },
		articleList: {
			type: new GraphQLList(ArticleType),
			resolve(parent) {
				return getArticleListQuery(parent.id);
			}
    },
    author: {
			type: UserType,
			resolve(parent) {
        return getUserByIdQuery(parent.authorId);
			}
    },
	})
});

const AuthType = new GraphQLObjectType({
	name: 'AuthType',
	fields: () => ({
		token: { type: GraphQLString },
		tokenExpirationTime: { type: GraphQLString },
		user: { type: UserType },
	})
});

const ArticleType = new GraphQLObjectType({
	name: 'Article',
	fields: () => ({
		id: { type: GraphQLID },
		blogId: { type: GraphQLID },
		name: { type: GraphQLString },
		content: { type: GraphQLString },
		createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    author: {
			type: UserType,
			resolve(parent) {
        return getUserByBlogIdQuery(parent.blogId);
			}
    },
    blog: {
			type: BlogType,
			resolve(parent) {
        return getBlogByIdQuery(parent.blogId);
			}
    },
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
    articles: {
			type: new GraphQLList(ArticleType),
			resolve(parent, args) {
        return getArticleListQuery();
			}
		},
		blogs: {
			type: new GraphQLList(BlogType),
			resolve(parent, args) {
        return getBlogListQuery();
			}
		},
		users: {
			type: new GraphQLList(UserType),
			resolve(parent, args) {
        return getUserListQuery();
			}
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
			resolve(parent, args) {
        return getUserByIdQuery(args.id);
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
              if (!user) {
                throw new Error(errorMap.USER_NOT_FOUND);
              }
              
              if (validatePassword(password, user.password)) {
                const token = issueJWT(user.id, '1m');
                resolve({ 
                  token,
                  user,
                });
              } else {
                throw new Error(errorMap.WRONG_PASSWORD);
              }
            }).catch((err) => reject(err));
        });
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		register: {
			type: AuthType,
			args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: function(parent, {
        username,
        password,
        email
      }) {
        if (password.length > 32) {
          throw new Error();
        }
        
        const passwordHash = JSON.stringify(generatePasswordHash(password));
        return new Promise((resolve, reject) => {
          createUserMutation({
            username,
            password: passwordHash,
            email
          }).then((user) => {
              const token = issueJWT(user.id, '1d');
              
              resolve({ 
                token,
                user,
              });
            })
            .catch((err) => reject(err));
        });
			}
    },
    updateUser: {
			type: UserType,
			args: {
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        description: { type: GraphQLString },
        photoUrl: { type: GraphQLString },
			},
			resolve(parent, args, context) {
        if (!context.user) {
          throw new Error(errorMap.UNAUTHORIZED);
        }
        const providedId = content.user.permissionList.includes['admin'] ?
          args.id || context.user.id :
          context.user.id;
        const passwordHash = generatePasswordHash(password);

				return updateUserMutation({
          id: providedId,
          username: args.username,
          password: passwordHash,
          email: args.email,
          description: args.description,
          photoUrl: args.photoUrl
        });
			}
		},
    deleteUser: {
			type: UserType,
			args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args, context) {
        if (!context.user) {
          throw new Error(errorMap.UNAUTHORIZED);
        }
        const providedId = content.user.permissionList.includes['admin'] ?
          args.id || context.user.id :
          context.user.id;

        return deleteUserMutation(providedId);
			}
		},
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
