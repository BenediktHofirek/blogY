const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const {
  getBlogListQuery,
  getBlogByIdQuery,
  getUserListQuery,
  getArticleListQuery,
  getUserByIdQuery,
  getUserByBlogIdQuery,
  createUserMutation,
  updateUserMutation,
  deleteUserMutation,
  deleteUserMutation,
} = require('../database/querys/querys.js');

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
		}
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
        return getUserByIdQuery(parent.authorId)
          .then((result) => {
            return result[0];
          });
			}
    },
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
        return getUserByBlogIdQuery(parent.blogId)
          .then((result) => {
            return result[0];
          });
			}
    },
    blog: {
			type: BlogType,
			resolve(parent) {
        return getBlogByIdQuery(parent.blogId)
          .then((result) => {
            return result[0];
          });
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
        return getArticleListQuery()
          .then((result) => {
            return result[0];
          });
			}
		},
		blogs: {
			type: new GraphQLList(BlogType),
			resolve(parent, args) {
        return getBlogListQuery()
          .then((result) => {
            return result[0];
          });
			}
		},
		users: {
			type: new GraphQLList(UserType),
			resolve(parent, args) {
        return getUserListQuery()
          .then((result) => {
            return result[0];
          });
			}
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
			resolve(parent, args) {
        return getUserByIdQuery(args.id)
          .then((result) => {
            return result[0];
          });
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		createUser: {
			type: UserType,
			args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        photoUrl: { type: GraphQLString },
			},
			resolve(parent, args) {
				return createUserMutation(args);
			}
    },
    updateUser: {
			type: UserType,
			args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        description: { type: GraphQLString },
        photoUrl: { type: GraphQLString },
			},
			resolve: async function(parent, args) {
        return updateUserMutation(args)
          .then((result) => {
            return result[0];
          });
			}
		},
    deleteUser: {
			type: UserType,
			args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, { id }) {
        return deleteUserMutation(id)
          .then((result) => {
            return result[0];
          });
			}
		},
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
