import { Action, createReducer, on, combineReducers } from '@ngrx/store';
import * as AppActions from '../actions/app.actions';

export const userMapKey = 'userMap';
export const userMapReducer = createReducer(
  {},
  on(AppActions.userMapSuccess, (
    state,
    {
      userMap,
    }) => ({
      ...state,
      ...userMap,
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