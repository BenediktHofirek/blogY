const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
const sanitizeHtml = require('sanitize-html');

const {
  getArticleQuery,
  getBlogQuery,
  getBlogListByAuthorIdQuery,
  getBlogListQuery,
  getBlogByIdQuery,
  getUserListQuery,
  getArticleListQuery,
  getArticleListByAuthorIdQuery,
  getArticleListByBlogIdQuery,
  getUserQuery,
  getUserByCredentialsQuery,
  getUserByBlogIdQuery,
  createUserMutation,
  updateUserMutation,
  deleteUserMutation,
  articleUpdateMutation,
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
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		email: { type: GraphQLString },
		description: { type: GraphQLString },
		photoUrl: { type: GraphQLString },
		createdAt: { type: GraphQLString },
		updatedAt: { type: GraphQLString },
		blogList: {
			type: new GraphQLList(BlogType),
			resolve(parent) {
				return getBlogListByAuthorIdQuery(parent.id);
			}
    },
    articleList: {
			type: new GraphQLList(ArticleType),
			resolve(parent) {
				return getArticleListByAuthorIdQuery(parent.id);
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
				return getArticleListByBlogIdQuery(parent.id);
			}
    },
    author: {
			type: UserType,
			resolve(parent) {
        return getUserQuery({ userId: parent.authorId });
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
		source: { type: GraphQLJSON },
		html: { type: GraphQLString },
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

const ArticleListType = new GraphQLObjectType({
	name: 'ArticleList',
	fields: () => ({
    articleList: { type: new GraphQLList(ArticleType) },
		count: { type: GraphQLInt }
	})
});

const BlogListType = new GraphQLObjectType({
	name: 'BlogList',
	fields: () => ({
    blogList: { type: new GraphQLList(BlogType) },
		count: { type: GraphQLInt }
	})
});

const UserListType = new GraphQLObjectType({
	name: 'UserList',
	fields: () => ({
    userList: { type: new GraphQLList(UserType) },
		count: { type: GraphQLInt }
	})
});


const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
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
          return errorMap.UNAUTHORIZED;
        }
        const providedId = context.user.permissionList.includes['admin'] ?
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
    articleUpdate: {
      type: ArticleType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        source: { type: GraphQLJSON },
      },
			resolve(parent, {
        id,
        name,
        source
      }, context) {
        if (!context.user) {
          return errorMap.UNAUTHORIZED;
        }

        const payload = {
          id,
          name
        };

        if (source) {
          payload.source = source;
          const dirtyHtml = new QuillDeltaToHtmlConverter(source.ops, {}).convert();
          //html is sanitized before saving to database
          const sanitizedHtml = sanitizeHtml(dirtyHtml, {
            allowedAttributes: {
              '*': ["style", "class"],
            },
            allowedStyles: {
              '*': {
                'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
                'background-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
                'text-align': [/^left$/, /^right$/, /^center$/],
                'align': [/^left$/, /^right$/, /^center$/],
                'font-size': [/^\d+(?:px|em|%)$/]
              },
            },
            allowedClasses: {
              '*': ["ql-tooltip", "ql-container", "ql-disabled", "ql-clipboard", "ql-indent-1", "ql-indent-2", "ql-indent-3", "ql-indent-4", "ql-indent-5", "ql-indent-6", "ql-indent-7", "ql-indent-8", "ql-indent-9", "ql-video", "ql-bg-black", "ql-bg-red", "ql-bg-orange", "ql-bg-yellow", "ql-bg-green", "ql-bg-blue", "ql-bg-purple", "ql-color-white", "ql-color-red", "ql-color-orange", "ql-color-yellow", "ql-color-green", "ql-color-blue", "ql-color-purple", "ql-font-serif", "ql-font-monospace", "ql-size-small", "ql-size-large", "ql-size-huge", "ql-direction-rtl", "ql-align-center", "ql-align-justify", "ql-align-right", "ql-editor", "ql-blank"],
            }
          });
          console.log('TTTTTTTTTT', dirtyHtml, sanitizedHtml);
          payload.html = sanitizedHtml;
        }

        return articleUpdateMutation(payload);
			}
    },
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
