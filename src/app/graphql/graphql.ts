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
  id: Scalars['Int'];
  username: Scalars['String'];
  email: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  photoUrl?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  blogList?: Maybe<Array<Maybe<Blog>>>;
  articleList?: Maybe<Array<Maybe<Article>>>;
};

export type Article = {
  __typename?: 'Article';
  id: Scalars['Int'];
  name: Scalars['String'];
  blogId: Scalars['Int'];
  content: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  author: User;
  blog: Blog;
};

export type Blog = {
  __typename?: 'Blog';
  id: Scalars['Int'];
  name: Scalars['String'];
  authorId: Scalars['Int'];
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
  articles?: Maybe<Array<Maybe<Article>>>;
  blogs?: Maybe<Array<Maybe<Blog>>>;
  users?: Maybe<Array<Maybe<User>>>;
  user?: Maybe<User>;
  login?: Maybe<Auth>;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryLoginArgs = {
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
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
      & Pick<User, 'id' | 'username' | 'email' | 'photoUrl' | 'description' | 'createdAt' | 'updatedAt'>
    ) }
  )> }
);

export type ArticlesQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ArticlesQueryQuery = (
  { __typename?: 'Query' }
  & { articles?: Maybe<Array<Maybe<(
    { __typename?: 'Article' }
    & Pick<Article, 'id' | 'name' | 'blogId' | 'content' | 'createdAt' | 'updatedAt'>
    & { author: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ), blog: (
      { __typename?: 'Blog' }
      & Pick<Blog, 'id' | 'name'>
    ) }
  )>>> }
);

export type BlogsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type BlogsQueryQuery = (
  { __typename?: 'Query' }
  & { blogs?: Maybe<Array<Maybe<(
    { __typename?: 'Blog' }
    & Pick<Blog, 'id' | 'name' | 'authorId' | 'createdAt' | 'updatedAt'>
    & { author?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    )>, articleList?: Maybe<Array<Maybe<(
      { __typename?: 'Article' }
      & Pick<Article, 'id' | 'name'>
    )>>> }
  )>>> }
);

export type LoginQueryQueryVariables = Exact<{
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password: Scalars['String'];
}>;


export type LoginQueryQuery = (
  { __typename?: 'Query' }
  & { login?: Maybe<(
    { __typename?: 'Auth' }
    & Pick<Auth, 'token'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email' | 'photoUrl' | 'description' | 'createdAt' | 'updatedAt'>
    ) }
  )> }
);

export type UserQueryQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type UserQueryQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email' | 'description' | 'photoUrl' | 'createdAt' | 'updatedAt'>
    & { blogList?: Maybe<Array<Maybe<(
      { __typename?: 'Blog' }
      & Pick<Blog, 'id' | 'name'>
    )>>>, articleList?: Maybe<Array<Maybe<(
      { __typename?: 'Article' }
      & Pick<Article, 'id' | 'name'>
    )>>> }
  )> }
);

export type UsersQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQueryQuery = (
  { __typename?: 'Query' }
  & { users?: Maybe<Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email' | 'description' | 'photoUrl' | 'createdAt' | 'updatedAt'>
    & { blogList?: Maybe<Array<Maybe<(
      { __typename?: 'Blog' }
      & Pick<Blog, 'id' | 'name'>
    )>>>, articleList?: Maybe<Array<Maybe<(
      { __typename?: 'Article' }
      & Pick<Article, 'id' | 'name'>
    )>>> }
  )>>> }
);

export const RegisterMutationDocument = gql`
    mutation RegisterMutation($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password) {
    token
    user {
      id
      username
      email
      photoUrl
      description
      createdAt
      updatedAt
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
export const ArticlesQueryDocument = gql`
    query ArticlesQuery {
  articles {
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
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ArticlesQueryGQL extends Apollo.Query<ArticlesQueryQuery, ArticlesQueryQueryVariables> {
    document = ArticlesQueryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const BlogsQueryDocument = gql`
    query BlogsQuery {
  blogs {
    id
    name
    authorId
    createdAt
    updatedAt
    author {
      id
      username
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
  export class BlogsQueryGQL extends Apollo.Query<BlogsQueryQuery, BlogsQueryQueryVariables> {
    document = BlogsQueryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoginQueryDocument = gql`
    query LoginQuery($username: String, $email: String, $password: String!) {
  login(username: $username, email: $email, password: $password) {
    token
    user {
      id
      username
      email
      photoUrl
      description
      createdAt
      updatedAt
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
    query UserQuery($id: String!) {
  user(id: $id) {
    id
    username
    email
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
export const UsersQueryDocument = gql`
    query UsersQuery {
  users {
    id
    username
    email
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
  export class UsersQueryGQL extends Apollo.Query<UsersQueryQuery, UsersQueryQueryVariables> {
    document = UsersQueryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }