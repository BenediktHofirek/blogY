import { createAction, props } from '@ngrx/store';
import { ArticleMap, BlogMap, User, UserMap } from '../models/app.models';

export const appLoad = createAction('[App] Load');

export const userMapLoad = createAction('UserMap Load');
export const userMapSuccess = createAction(
  '[UserMap] Success',
  props<{
    userMap: UserMap,
  }>()
);

export const articleMapLoad = createAction('ArticleMap Load');
export const articleMapSuccess = createAction(
  '[ArticleMap] Success',
  props<{
    articleMap: ArticleMap,
  }>()
);

export const blogMapLoad = createAction('BlogMap Load');
export const blogMapSuccess = createAction(
  '[BlogMap] Success',
  props<{
    blogMap: BlogMap,
  }>()
);

//currentUser
export const currentUserLoad = createAction(
  'CurrentUser Load',
  props<{
    currentUserId: string,
  }>()
);

export const currentUserSuccess = createAction(
  'CurrentUser Success',
  props<{
    currentUser: User | null | undefined,
  }>()
);