import { Action, createReducer, on, combineReducers } from '@ngrx/store';
import * as ContentTableActions from './content-table.actions';

export const contentTableKey = 'contentTableSettings';

export default createReducer(
  {
    display: "articles",
    sortBy: "name",
    timeframe: "all",
    pageSize: 10,
    pageIndex: 0,
    orderBy: 'ASC',
    filter: "",
    collectionSize: 0,
  },
  on(ContentTableActions.stateSuccess, (state,newState) => ({
      ...state,
      ...newState,
     })),
);



