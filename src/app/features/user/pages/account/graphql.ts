import gql from "graphql-tag";

export const userUpdateMutation = gql`
  mutation UserUpdateMutation(
      $id: ID!,
      $username: String,
      $firstName: String,
      $lastName: String,
      $email: String,
      $image: String,
    ) {
    userUpdate(
      id: $id,
      username: $username,
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      image: $image
    ) {
      id
      username
      email
      firstName
      lastName
      description
      image
      createdAt
      updatedAt
      blogList {
        id
        name
      }
      articleList {
        id
        name
      }
    }
  }
`;