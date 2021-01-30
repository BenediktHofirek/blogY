import gql from "graphql-tag";

export const articleQuery = gql`
  query ArticleQuery(
      $blogName: String!,
      $articleName: String!
      $username: String!
    ) {
    article(
      blogName: $blogName,
      articleName: $articleName
      username: $username
    ) {
      id
      name
      content
      createdAt
      updatedAt
      author {
        id
        username
      }
      blog {
        id
        name
      }
    }
  }
`;