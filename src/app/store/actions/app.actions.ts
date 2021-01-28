import { createAction, props } from '@ngrx/store';
import { User } from '../models/app.models';

export const appLoad = createAction('[App] Load');

//currentUser
export const currentUserLoad = createAction(
  'CurrentUser Load',
  props<{
    id: string,
  }>()
);

export const currentUserSuccess = createAction(
  'CurrentUser Success',
  props<{
    currentUser: User | {},
  }>()
);