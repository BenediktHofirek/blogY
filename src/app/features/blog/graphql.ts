import gql from "graphql-tag";

export const articleListQuery = gql`
  query ArticleListQuery(
      $offset: Int,
      $limit: Int,
      $filter: String,
      $sortBy: String,
      $orderBy: String,
      $timeframe: Int
    ) {
    articleList(
      offset: $offset,
      limit: $limit,
      filter: $filter,
      sortBy: $sortBy,
      orderBy: $orderBy,
      timeframe: $timeframe
    ) {
      count
      articleList {
        id
        name
        content
        createdAt
        updatedAt
      }
    }
  }
`;

export const blogQuery = gql`
  query BlogQuery(
      $blogName: String!,
      $username: String!
    ) {
    blog(
      blogName: $blogName,
      username: $username
    ) {
      id
      name
      description
      viewCount
      ratingAverage
      createdAt
      updatedAt
      author {
        id
        firstName
        lastName
        username
        birthdate
        photoUrl
      }
    }
  }
`;