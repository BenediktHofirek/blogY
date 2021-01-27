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
      count
    }
  }
`;

const blogsQuery = gql`
  query BlogsQuery($_id: String!) {
    document(_id: $_id) {
      title
      author
      dateCreated
      pages {
        _id
        pageNr
        text
      }
    }
  }
`;

const authorsQuery = gql`
  query AuthorsQuery($_id: String!) {
    document(_id: $_id) {
      title
      author
      dateCreated
      pages {
        _id
        pageNr
        text
      }
    }
  }
`;

export default { 
  articleListQuery,
  authorsQuery,
  blogsQuery,
};