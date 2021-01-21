export interface Article {
  author_id: string,
  created_at: string,
  name: string,
}
 
export interface User {
  id: string;
  email: string;
  username: string;
  blogIdList: string[],
  imageUrl: string,
  description: string,
}

export interface Blog {
  id: string,
  author_id: string,
  created_at: string,
  name: string,
}

export interface BlogMap {
  [key: string]: Blog
}

export interface ArticleMap {
  [key: string]: Article
}

export interface UserMap {
  [key: string]: User
}