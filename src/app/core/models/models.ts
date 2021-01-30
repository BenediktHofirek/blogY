export interface Article {
  id: string,
  blogId: string,
  authorId: string,
  createdAt: string,
  updatedAt: string,
  name: string,
  source: JSON,
  html: string,
  author: User,
  blog: Blog,
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string,
  username: string;
  photoUrl: string,
  description: string,
}

export interface Blog {
  id: string,
  authorId: string,
  createdAt: string,
  updatedAt: string,
  name: string,
  author: User
}
