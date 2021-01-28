import gql from "graphql-tag";

const articleListQuery = gql`
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
        blogId
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
  }
`;

const blogListQuery = gql`
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

const userListQuery = gql`
  query UserListQuery(
      $offset: Int,
      $limit: Int,
      $filter: String,
      $sortBy: String,
      $orderBy: String,
      $timeframe: Int
    ) {
    userList(
      offset: $offset,
      limit: $limit,
      filter: $filter,
      sortBy: $sortBy,
      orderBy: $orderBy,
      timeframe: $timeframe
    ) {
      count
      userList {
        id
        firstName
        lastName
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export default { 
  articleListQuery,
  blogListQuery,
  userListQuery,
};