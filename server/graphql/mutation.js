const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
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
  markMessageAsDeletedMutation,
  markMessageAsArchivedMutation,
  markMessageAsReadedMutation,
  restoreMessageMutation,
  ratingDeleteMutation,
  ratingUpdateMutation,
  ratingCreateMutation,
  viewDeleteMutation,
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
          payload.html = sanitizedHtml;
        }

        return articleUpdateMutation(payload);
			}
    },
	}
});