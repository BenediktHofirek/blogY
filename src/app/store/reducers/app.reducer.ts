import { Action, createReducer, on, combineReducers } from '@ngrx/store';
import * as AppActions from '../actions/app.actions';

export const authorMapReducer = createReducer(
  {},
  on(AppActions.authorMapSuccess, (
    state,
    {
      authorMap,
    }) => ({
      ...state,
      authorMap,
     })),
);

export const articleMapReducer = createReducer(
  {},
  on(AppActions.articleMapSuccess, (
    state,
    {
      articleMap,
    }) => ({
      ...state,
      articleMap,
     })),
);

export const blogMapReducer = createReducer(
  {},
  on(AppActions.blogMapSuccess, (
    state,
    {
      blogMap,
    }) => ({
      ...state,
      blogMap,
     })),
);

export interface State {
  articleMap: object,
  authorMap: object,
  blogMap: object,
}

export const initialState: State = {
  articleMap: {},
  authorMap: {},
  blogMap: {},
}

export const appReducer = combineReducers(
  {
    articleMap: articleMapReducer,
    authorMap: authorMapReducer,
    blogMap: blogMapReducer,
  }
);
