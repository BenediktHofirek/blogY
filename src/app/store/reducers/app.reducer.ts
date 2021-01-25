import { Action, createReducer, on, combineReducers } from '@ngrx/store';
import * as AppActions from '../actions/app.actions';

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


export const currentUserReducer = createReducer(
  { isLoading: true },
  on(AppActions.currentUserSuccess, (state,
    {
      currentUser,
    }: {currentUser: any}) => ({
      ...currentUser,
     })),
);