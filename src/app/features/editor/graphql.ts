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
      isPublished
      allowComments
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
      $isPublished: Boolean,
      $allowComments: Boolean
    ) {
    articleUpdate(
      id: $id,
      name: $name,
      source: $source,
      isPublished: $isPublished,
      allowComments: $allowComments
    ) {
      id
      name
      source
      html
      isPublished
      allowComments
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