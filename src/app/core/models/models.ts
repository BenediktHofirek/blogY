export interface Article {
  id: string,
  blogId: string,
  authorId: string,
  createdAt: string,
  updatedAt: string,
  name: string,
  source: JSON,
  viewCount: number,
  isPublished: boolean,
  allowComments: boolean,
  ratingAverage: number,
  html: string,
  author: User,
  blog: Blog,
}

export interface User {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  username: string,
  birthdate: string,
  viewCount: number,
  ratingAverage: number,
  photoUrl: string,
  description: string,
}

export interface Blog {
  id: string,
  authorId: string,
  createdAt: string,
  updatedAt: string,
  name: string,
  viewCount: number,
  ratingAverage: number,
  description: string,
  author: User
}
