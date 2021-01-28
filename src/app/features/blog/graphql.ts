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

export const blogListQuery = gql`
  query BlogListQuery(
      $offset: Int,
      $limit: Int,
      $filter: String,
      $sortBy: String,
      $orderBy: String,
      $timeframe: Int
    ) {
    blogList(
      offset: $offset,
      limit: $limit,
      filter: $filter,
      sortBy: $sortBy,
      orderBy: $orderBy,
      timeframe: $timeframe
    ) {
      count
      blogList {
        id
        name
        authorId
        createdAt
        updatedAt
        articleList {
          id
          name
        }
        author {
          id
          username
          firstName
          lastName
        }
      }
    }
  }
`;

export const userQuery = gql`
  query UserQuery($username: String!) {
    user(username: $username) {
      id
      username
      email
      description
      photoUrl
      createdAt
    }
  }
`;

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
        firstName
        lastName
        username
        photoUrl
      }
      blog {
        id
        name
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
      createdAt
      updatedAt
      author {
        id
        firstName
        lastName
        username
        photoUrl
      }
    }
  }
`;