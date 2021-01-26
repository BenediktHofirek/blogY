import { Action, createReducer, on, combineReducers } from '@ngrx/store';
import * as ContentTableActions from './content-table.actions';

export const contentTableKey = 'contentTableSettings';

export default createReducer(
  {
    display: "articles",
    sortBy: "newest",
    timeframe: "all",
    itemsPerPage: 10,
    pageNumber: 0,
    orderBy: "ASC",
    filter: "",
  },
  on(ContentTableActions.stateSuccess, (state,newState) => ({
      ...state,
      ...newState,
     })),
);



