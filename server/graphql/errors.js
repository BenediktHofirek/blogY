const { GraphQLError } = require('graphql');

const errorMap = {
  WRONG_PASSWORD: new GraphQLError("You provided wrong password"),
  USER_NOT_FOUND: new GraphQLError("No user with given username or email was found"),
  UNAUTHORIZED: new GraphQLError("You must be logged in"),
}

module.exports = {
  errorMap,
}