var { Query } = require('./query');
var { Mutation } = require('./mutation');

module.exports = new GraphQLSchema({
	query: Query,
	mutation: Mutation
});
