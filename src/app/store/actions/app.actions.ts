import { createAction, props } from '@ngrx/store';

export const appLoad = createAction('[App] Load');

export const userMapLoad = createAction('UserMap Load');
export const userMapSuccess = createAction(
  '[UserMap] Success',
  props<{
    userMap: object,
  }>()
);

export const articleMapLoad = createAction('ArticleMap Load');
export const articleMapSuccess = createAction(
  '[ArticleMap] Success',
  props<{
    articleMap: object,
  }>()
);

export const blogMapLoad = createAction('BlogMap Load');
export const blogMapSuccess = createAction(
  '[BlogMap] Success',
  props<{
    blogMap: object,
  }>()
);