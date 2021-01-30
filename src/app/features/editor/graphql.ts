import gql from "graphql-tag";

export const articleQuery = gql`
  query ArticleQuery(
      $blogName: String!,
      $articleName: String!,
      $username: String!
    ) {
    article(
      blogName: $blogName,
      articleName: $articleName,
      username: $username
    ) {
      id
      name
      source
      html
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

export const articleUpdateMutation = gql`
  mutation ArticleUpdateMutation(
      $id: ID!,
      $name: String,
      $source: JSON,
    ) {
    articleUpdate(
      id: $id,
      name: $name,
      source: $source,
    ) {
      id
      name
      source
      html
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