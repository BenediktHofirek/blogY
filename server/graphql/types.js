const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');

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

export const BlogType = new GraphQLObjectType({
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

export const AuthType = new GraphQLObjectType({
	name: 'AuthType',
	fields: () => ({
		token: { type: GraphQLString },
		tokenExpirationTime: { type: GraphQLString },
		user: { type: UserType },
	})
});

export const ArticleType = new GraphQLObjectType({
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

export const ArticleListType = new GraphQLObjectType({
	name: 'ArticleList',
	fields: () => ({
    articleList: { type: new GraphQLList(ArticleType) },
		count: { type: GraphQLInt }
	})
});

export const BlogListType = new GraphQLObjectType({
	name: 'BlogList',
	fields: () => ({
    blogList: { type: new GraphQLList(BlogType) },
		count: { type: GraphQLInt }
	})
});

export const UserListType = new GraphQLObjectType({
	name: 'UserList',
	fields: () => ({
    userList: { type: new GraphQLList(UserType) },
		count: { type: GraphQLInt }
	})
});
