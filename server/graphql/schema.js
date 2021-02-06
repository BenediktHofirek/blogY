var RootQuery = require('./query');
var Mutation = require('./mutation');
var { GraphQLSchema } = require('graphql');

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
