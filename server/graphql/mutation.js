const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql;
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
const sanitizeHtml = require('sanitize-html');

const {
  UserType,
  CommentType,
  MessageType,
	BlogType,
  ArticleType,
  AuthType,
	ArticleListType,
	BlogListType,
	UserListType,
} = require('./types');

const {
  getUserQuery,
} = require('../database/queries/queries');

const {
  userCreateMutation,
  userUpdateMutation,
  userDeleteMutation,
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

module.exports = new GraphQLObjectType({
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
          userCreateMutation({
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
    userUpdate: {
			type: UserType,
			args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        birthdate: { type: GraphQLString },
        description: { type: GraphQLString },
        photoUrl: { type: GraphQLString },
			},
			resolve(parent, args, context) {
        if (!context.user) {
          return errorMap.UNAUTHORIZED;
        }

        const payload = {
          ...args
        };

        if (args.password) {
          payload.password = generatePasswordHash(args.password);
        }
        
				return userUpdateMutation(payload);
			}
		},
    userDelete: {
			type: UserType,
			args: {
        password: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, {password}, {user}) {
        return new Promise((resolve, reject) => {
          getUserQuery({userId: user.id})
            .then(async(user) => {
              if (!user) {
                reject(errorMap.USER_NOT_FOUND);
              }else if (validatePassword(password, user.password)) {
                const deletedUser = await userDeleteMutation(user.id);
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
        isPublished: { type: GraphQLBoolean },
        allowComments: { type: GraphQLBoolean },
      },
			resolve(parent, {
        id,
        name,
        source,
        isPublished,
        allowComments
      }, context) {
        if (!context.user) {
          return errorMap.UNAUTHORIZED;
        }

        const payload = {
          id,
          name,
          isPublished,
          allowComments,
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
			type: CommentType,
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
			type: CommentType,
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
			type: CommentType,
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
    type: BlogType,
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
    type: BlogType,
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
    type: BlogType,
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
    type: MessageType,
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
    type: MessageType,
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
    type: GraphQLInt,
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
    type: GraphQLInt,
    args: {
      articleId: { type: new GraphQLNonNull(GraphQLID) }, 
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
    type: GraphQLInt,
    args: {
      articleId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(parent, args, context) {
      return ratingDeleteMutation({
        articleId: args.articleId,
        userId: context.user.id
      });
    }
  },
  viewCreate: {
    type: GraphQLString,
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
    type: GraphQLString,
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