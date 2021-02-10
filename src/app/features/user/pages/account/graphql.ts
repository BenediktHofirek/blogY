import gql from "graphql-tag";

export const userUpdateMutation = gql`
  mutation UserUpdateMutation(
      $id: ID!,
      $username: String,
      $firstName: String,
      $lastName: String,
      $email: String,
      $photoUrl: String,
    ) {
    userUpdate(
      id: $id,
      username: $username,
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      photoUrl: $photoUrl
    ) {
      id
      username
      email
      firstName
      lastName
      description
      photoUrl
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