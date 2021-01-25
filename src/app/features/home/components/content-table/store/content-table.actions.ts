import { createAction, props } from '@ngrx/store';
import { ContentTableState } from './content-table.models';

export const stateSuccess = createAction(
  '[ContentTable] StateSuccess',
  props<ContentTableState>()
);