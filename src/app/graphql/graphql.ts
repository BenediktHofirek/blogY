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
  userId: Scalars['Int'];
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type Auth = {
  __typename?: 'Auth';
  token: Scalars['String'];
  tokenExpirationTime: Scalars['String'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  articles?: Maybe<Array<Maybe<Article>>>;
  login?: Maybe<User>;
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

export type LoginQueryQueryVariables = Exact<{
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password: Scalars['String'];
}>;


export type LoginQueryQuery = (
  { __typename?: 'Query' }
  & { login?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email' | 'photoUrl' | 'description' | 'createdAt' | 'updatedAt'>
  )> }
);

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
export const LoginQueryDocument = gql`
    query LoginQuery($username: String, $email: String, $password: String!) {
  login(username: $username, email: $email, password: $password) {
    id
    username
    email
    photoUrl
    description
    createdAt
    updatedAt
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