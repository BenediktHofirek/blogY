import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};



export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  email: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  photoUrl?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  blogList?: Maybe<Array<Maybe<Blog>>>;
  articleList?: Maybe<Array<Maybe<Article>>>;
};

export type Article = {
  __typename?: 'Article';
  id: Scalars['ID'];
  name: Scalars['String'];
  blogId: Scalars['ID'];
  content: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  author: User;
  blog: Blog;
};

export type Blog = {
  __typename?: 'Blog';
  id: Scalars['ID'];
  name: Scalars['String'];
  authorId: Scalars['ID'];
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  author?: Maybe<User>;
  articleList?: Maybe<Array<Maybe<Article>>>;
};

export type Auth = {
  __typename?: 'Auth';
  token: Scalars['String'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  login?: Maybe<Auth>;
};


export type QueryUserArgs = {
  userId: Scalars['ID'];
};


export type QueryLoginArgs = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  register?: Maybe<Auth>;
};


export type MutationRegisterArgs = {
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password: Scalars['String'];
};

export type RegisterMutationMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutationMutation = (
  { __typename?: 'Mutation' }
  & { register?: Maybe<(
    { __typename?: 'Auth' }
    & Pick<Auth, 'token'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email' | 'firstName' | 'lastName' | 'description' | 'photoUrl' | 'createdAt' | 'updatedAt'>
      & { blogList?: Maybe<Array<Maybe<(
        { __typename?: 'Blog' }
        & Pick<Blog, 'id' | 'name'>
      )>>>, articleList?: Maybe<Array<Maybe<(
        { __typename?: 'Article' }
        & Pick<Article, 'id' | 'name'>
      )>>> }
    ) }
  )> }
);

export type LoginQueryQueryVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginQueryQuery = (
  { __typename?: 'Query' }
  & { login?: Maybe<(
    { __typename?: 'Auth' }
    & Pick<Auth, 'token'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email' | 'firstName' | 'lastName' | 'description' | 'photoUrl' | 'createdAt' | 'updatedAt'>
      & { blogList?: Maybe<Array<Maybe<(
        { __typename?: 'Blog' }
        & Pick<Blog, 'id' | 'name'>
      )>>>, articleList?: Maybe<Array<Maybe<(
        { __typename?: 'Article' }
        & Pick<Article, 'id' | 'name'>
      )>>> }
    ) }
  )> }
);

export type UserQueryQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type UserQueryQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email' | 'firstName' | 'lastName' | 'description' | 'photoUrl' | 'createdAt' | 'updatedAt'>
    & { blogList?: Maybe<Array<Maybe<(
      { __typename?: 'Blog' }
      & Pick<Blog, 'id' | 'name'>
    )>>>, articleList?: Maybe<Array<Maybe<(
      { __typename?: 'Article' }
      & Pick<Article, 'id' | 'name'>
    )>>> }
  )> }
);

export const RegisterMutationDocument = gql`
    mutation RegisterMutation($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password) {
    token
    user {
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
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterMutationGQL extends Apollo.Mutation<RegisterMutationMutation, RegisterMutationMutationVariables> {
    document = RegisterMutationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoginQueryDocument = gql`
    query LoginQuery($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    token
    user {
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
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginQueryGQL extends Apollo.Query<LoginQueryQuery, LoginQueryQueryVariables> {
    document = LoginQueryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserQueryDocument = gql`
    query UserQuery($userId: ID!) {
  user(userId: $userId) {
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

  @Injectable({
    providedIn: 'root'
  })
  export class UserQueryGQL extends Apollo.Query<UserQueryQuery, UserQueryQueryVariables> {
    document = UserQueryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }