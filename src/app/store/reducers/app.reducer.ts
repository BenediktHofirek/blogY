import { Action, createReducer, on, combineReducers } from '@ngrx/store';
import * as AppActions from '../actions/app.actions';

export const currentUserReducer = createReducer(
  { isLoading: true },
  on(AppActions.currentUserSuccess, (state,
    {
      currentUser,
    }: {currentUser: any}) => ({
      ...currentUser,
     })),
);