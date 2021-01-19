import { createAction, props } from '@ngrx/store';

export const appLoad = createAction('[App] Load');
export const authorMapSuccess = createAction(
  '[AuthorMap] Success',
  props<{
    authorMap: object,
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