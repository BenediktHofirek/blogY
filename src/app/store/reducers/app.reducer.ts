import { Action, createReducer, on, combineReducers } from '@ngrx/store';
import * as AppActions from '../actions/app.actions';

export const authorMapKey = 'authorMap';
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

export const articleMapKey = 'articleMap';
export const articleMapReducer = createReducer(
  {},
  on(AppActions.articleMapSuccess, (
    state,
    {
      articleMap,
    }) => ({
      ...state,
      ...articleMap,
     })),
);

export const blogMapKey = 'blogMap';
export const blogMapReducer = createReducer(
  {},
  on(AppActions.blogMapSuccess, (
    state,
    {
      blogMap,
    }) => ({
      ...state,
      ...blogMap,
     })),
);