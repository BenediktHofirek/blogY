import { createSelector } from '@ngrx/store';
import { ArticleMap, Blog, BlogMap, User, UserMap } from '../models/app.models';
 
export interface AppState {
  articleMap: ArticleMap,
  blogMap: BlogMap,
  userMap: UserMap,
  currentUser: User,
}
 
export const selectArticleMap = (state: AppState): ArticleMap => state.articleMap;
export const selectBlogMap = (state: AppState): BlogMap => state.blogMap;
export const selectUserMap = (state: AppState): UserMap => state.userMap;
 
export const selectAuthorMap = createSelector(
  selectBlogMap,
  selectUserMap,
  (blogMap: BlogMap, userMap: UserMap) => {
    const authorMap: UserMap = {};
    const userIdList = Object.values(userMap).map((user: User) => user.id);

    Object.values(blogMap).forEach((blog: Blog) => {
      if (userIdList.includes(blog.author_id)) {
        authorMap[blog.author_id] = {
          ...userMap[blog.author_id],
        };
      }
    });

    return authorMap;
  }
);