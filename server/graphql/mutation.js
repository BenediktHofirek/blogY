const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql;
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
const sanitizeHtml = require('sanitize-html');

const {
	UserType,
	BlogType,
	ArticleType,
	ArticleListType,
	BlogListType,
	UserListType,
} = require('./types');

const {
  getUserQuery,
} = require('../database/queries/queries');

const {
  createUserMutation,
  updateUserMutation,
  deleteUserMutation,
  articleCreateMutation,
  articleDeleteMutation,
  articleUpdateMutation,
  commentCreateMutation,
  commentDeleteMutation,
  commentUpdateMutation,
  blogCreateMutation,
  blogDeleteMutation,
  blogUpdateMutation,
  messageCreateMutation,
  messageUpdateMutation,
  ratingDeleteMutation,
  ratingUpdateMutation,
  ratingCreateMutation,
  viewUpdateMutation,
  viewCreateMutation,
} = require('../database/mutations/mutations');

const {
  generatePasswordHash,
  validatePassword,
  issueJWT,
} = require('../auth/utils.js');

const { errorMap } = require('./errors.js');

export const Mutation = new GraphQLObjectType({
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

        const payload = {
          id: context.user.id,
          username: args.username,
          email: args.email,
          description: args.description,
          photoUrl: args.photoUrl
        };

        if (args.password) {
          payload.password = generatePasswordHash(args.password);
        }

				return updateUserMutation(payload);
			}
		},
    deleteUser: {
			type: UserType,
			args: {
        password: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, {password}, {user}) {
        return new Promise(async(resolve, reject) => {
          getUserQuery({userId: user.id})
            .then((user) => {
              if (!user) {
                reject(errorMap.USER_NOT_FOUND);
              }else if (validatePassword(password, user.password)) {
                const deletedUser = await deleteUserMutation(user.id);
                resolve(deletedUser);
              } else {
                reject(errorMap.WRONG_PASSWORD);
              }
            }).catch((err) => { reject(errorMap.USER_NOT_FOUND); });
        });
			}
    },
    articleCreate: {
			type: ArticleType,
			args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        blogId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args, context) {
        return articleCreateMutation(args);
			}
    },
    articleDelete: {
			type: ArticleType,
			args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        blogId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args, context) {
        return articleDeleteMutation({
          articleId: args.id,
          authorId: context.user.id
        });
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
          name,
          authorId: context.user.id,
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
          payload.html = sanitizedHtml;
        }

        return articleUpdateMutation(payload);
			}
    },
    commentCreate: {
			type: commentType,
			args: {
        text: { type: new GraphQLNonNull(GraphQLString) },
        articleId: { type: new GraphQLNonNull(GraphQLID) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
        parentId: { type: GraphQLID },
			},
			resolve(parent, args, context) {
        return commentCreateMutation(args);
			}
    },
    commentUpdate: {
			type: commentType,
			args: {
        id: { type: new GraphQLNonNull(GraphQLID) },              
        text: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, args, context) {
        return commentUpdateMutation({
          ...args,
          userId: context.user.id
        });
			}
    },
    commentDelete: {
			type: commentType,
			args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args, context) {
        return commentDeleteMutation({
          commentId: args.id,
          userId: context.user.id
        });
			}
    },
  },
  blogCreate: {
    type: blogType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, {name}, context) {
      return blogCreateMutation({
        name,
        authorId: context.user.id
      });
    }
  },
  blogUpdate: {
    type: blogType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },              
      name: { type: GraphQLString },
      description: { type: GraphQLString },
    },
    resolve(parent, args, context) {
      return blogUpdateMutation({
        ...args,
        authorId: context.user.id
      });
    }
  },
  blogDelete: {
    type: blogType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(parent, args, context) {
      return blogDeleteMutation({
        blogId: args.id,
        authorId: context.user.id
      });
    }
  },
  messageCreate: {
    type: messageType,
    args: {
      receiverId: { type: new GraphQLNonNull(GraphQLID) },  
      text: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args, context) {
      return messageCreateMutation({
        ...args,
        senderId: context.user.id
      });
    }
  },
  messageUpdate: {
    type: messageType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },              
      isReaded: { type: GraphQLBoolean },
      isArchived: { type: GraphQLBoolean },
      isDeleted: { type: GraphQLBoolean },
    },
    resolve(parent, args, context) {
      return messageUpdateMutation({
        ...args,
        receiverId: context.user.id
      });
    }
  },
  ratingCreate: {
    type: ratingType,
    args: {
      rating: { type: new GraphQLNonNull(GraphQLInt) },
      articleId: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve(parent, args, context) {
      return ratingCreateMutation({
        ...args,
        userId: context.user.id
      });
    }
  },
  ratingUpdate: {
    type: ratingType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },    
      rating: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve(parent, args, context) {
      return ratingUpdateMutation({
        ...args,
        userId: context.user.id
      });
    }
  },
  ratingDelete: {
    type: ratingType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(parent, args, context) {
      return ratingDeleteMutation({
        id: args.id,
        userId: context.user.id
      });
    }
  },
  viewCreate: {
    type: viewType,
    args: {
      articleId: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve(parent, {articleId}, context) {
      return viewCreateMutation({
        articleId,
        userId: context.user.id
      });
    }
  },
  viewUpdate: {
    type: viewType,
    args: {
      articleId: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve(parent, args, context) {
      return viewUpdateMutation({
        ...args,
        userId: context.user.id
      });
    }
  }
});