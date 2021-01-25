import gql from "graphql-tag";

const articlesQuery = gql`
  query ArticlesQuery($_id: String!) {
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
  articlesQuery,
  authorsQuery,
  blogsQuery,
};