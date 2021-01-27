import { Action, createReducer, on, combineReducers } from '@ngrx/store';
import * as ContentTableActions from './content-table.actions';

export const contentTableKey = 'contentTableSettings';

export default createReducer(
  {
    display: "articles",
    sortBy: "name",
    timeframe: "all",
    itemsPerPage: 10,
    pageNumber: 0,
    orderBy: 'ASC',
    filter: "",
    collectionSize: 0,
  },
  on(ContentTableActions.stateSuccess, (state,newState) => {
    console.log('reducer', state, newState);
    return {
      ...state,
      ...newState,
     }}),
);



