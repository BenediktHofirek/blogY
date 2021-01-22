
const models, { sequelize } = require('../database/models');
const { QueryTypes } = require('sequelize');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

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
				return sequelize.query(`
          SELECT
            id,
            author_id as "authorId",
            name,
            created_at as "createdAt",
            updated_at as "updatedAt"
          FROM blogs
          WHERE author_id = :authorId
        `, {
          replacements: {
            authorId: parent.id,
          },
          type: QueryTypes.SELECT
        });
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
				return sequelize.query(`
          SELECT
            id,
            blog_id as "blogId",
            name,
            content,
            created_at as "createdAt",
            updated_at as "updatedAt"
          FROM articles
          WHERE blog_id = :blogId
        `, {
          replacements: {
            blogId: parent.id,
          },
          type: QueryTypes.SELECT
        });
			}
    },
    author: {
			type: UserType,
			resolve(parent) {
				return sequelize.query(`
          SELECT 
            id,
            description,
            email,
            photo_url as "photoUrl",
            username,
            created_at as "createdAt",
            updated_at as "updatedAt"
          FROM users
          WHERE id = :authorId
        `, {
          replacements: {
            authorId: parent.authorId,
          },
          type: QueryTypes.SELECT,
        }).then((result) => {
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
				return sequelize.query(`
          SELECT 
            id,
            description,
            email,
            photo_url as "photoUrl",
            username,
            created_at as "createdAt",
            updated_at as "updatedAt"
          FROM users
          WHERE users.id = (
              SELECT
                author_id
              FROM blogs
              WHERE blogs.id = :blogId
            )
        `, {
          replacements: {
            blogId: parent.blogId,
          },
          type: QueryTypes.SELECT,
        }).then((result) => {
          return result[0];
        });
			}
    },
    blog: {
			type: BlogType,
			resolve(parent) {
				return sequelize.query(`
          SELECT 
            id,
            name,
            author_id as "authorId",
            created_at as "createdAt",
            updated_at as "updatedAt"
          FROM blogs
          WHERE blogs.id = :blogId
        `, {
          replacements: {
            blogId: parent.blogId,
          },
          type: QueryTypes.SELECT,
        }).then((result) => {
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
				return sequelize.query(`
          SELECT 
            id,
            name,
            content,
            blog_id as "blogId",
            created_at as "createdAt",
            updated_at as "updatedAt"
          FROM articles
        `).then((result) => {
          return result[0];
        });
			}
		},
		blogs: {
			type: new GraphQLList(BlogType),
			resolve(parent, args) {
				return sequelize.query(`
          SELECT 
            id,
            name,
            author_id as "authorId",
            created_at as "createdAt",
            updated_at as "updatedAt"
          FROM blogs
        `).then((result) => {
          return result[0];
        });
			}
		},
		users: {
			type: new GraphQLList(UserType),
			resolve(parent, args) {
				return sequelize.query(`
          SELECT 
            id,
            description,
            email,
            photo_url as "photoUrl",
            username,
            created_at as "createdAt",
            updated_at as "updatedAt"
          FROM users
        `).then((result) => {
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
				return sequelize.query(`
          SELECT 
            id,
            description,
            email,
            photo_url as "photoUrl",
            username,
            created_at as "createdAt",
            updated_at as "updatedAt"
          FROM users
          WHERE id = :userId
        `, {
          userId: args.id,
        }).then((result) => {
          console.log('result', result);
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
			resolve: async function(parent, {
        username,
        password,
        email,
        description,
        photoUrl,
      }) {
				const newUserBuild = models.user.build({
          username,
          password,
          email,
          description,
          photoUrl,
        });
        const newUser = await newUserBuild.save();
        return newUser;
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
				return sequelize.query(`
          UPDATE users
          SET
            username = COALESCE(:username, username),
            password = COALESCE(:password, password),
            email = COALESCE(:email, email),
            description = COALESCE(:description, description),
            photo_url = COALESCE(:photoUrl, photo_url)
          WHERE id = :id
          RETURNING *
        `, args).then((result) => {
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
				return sequelize.query(`
          DELETE FROM users
          WHERE id = :userId
          RETURNING *
        `,{ userId: id }).then((result) => {
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
