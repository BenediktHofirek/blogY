import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { UserQueryGQL } from 'src/app/graphql/graphql';
import { currentUserSuccess } from '../actions/app.actions';
 
@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private userQueryGQL: UserQueryGQL,
  ) {}
  
  // loadApp$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType('[App] Load'),
  //     mergeMap(() => [
  //       articleMapLoad(),
  //       blogMapLoad(),
  //       userMapLoad(),
  //     ])
  //   )
  // );

  loadCurrentUser$ = createEffect(() => this.actions$.pipe(
    ofType('CurrentUser Load'),
    mergeMap((loadAction: any) => 
      this.userQueryGQL.fetch({ userId: `${loadAction.id}` })
      .pipe(
        map((result) => {
          let currentUser: any = {};
          if (result.data.user) {
            currentUser = result.data.user;
          }
          return currentUserSuccess({ currentUser });
        },
        catchError(() => 'EMPTY')
      )
    ))
  ));
}