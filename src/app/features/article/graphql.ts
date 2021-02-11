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
      html
      myRating
      ratingAverage
      viewCount
      createdAt
      updatedAt
      author {
        id
        firstName
        lastName
        username
        image
      }
      blog {
        id
        name
      }
    }
  }
`;