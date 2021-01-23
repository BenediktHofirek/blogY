import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Apollo } from 'apollo-angular';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { articleMapLoad, articleMapSuccess, blogMapLoad, blogMapSuccess, userMapLoad, userMapSuccess } from '../actions/app.actions';
import { BlogMap } from '../models/app.models';
 
@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private apollo: Apollo,
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

  // loadArticleMap$ = createEffect(() => this.actions$.pipe(
  //   ofType('ArticleMap Load'),
  //   mergeMap(() => from(this.db.read(this.db.collectionMap.articles))
  //     .pipe(
  //       map(articleMap => articleMapSuccess({ articleMap }),
  //       catchError(() => 'EMPTY')
  //     )
  //   ))
  // ));

  // loadBlogMap$ = createEffect(() => this.actions$.pipe(
  //   ofType('BlogMap Load'),
  //   mergeMap(() => from(this.db.read(this.db.collectionMap.blogs))
  //     .pipe(
  //       map((blogMap: BlogMap) => blogMapSuccess({ blogMap }),
  //       catchError(() => 'EMPTY')
  //     )
  //   ))
  // ));

  // loadUserMap$ = createEffect(() => this.actions$.pipe(
  //   ofType('UserMap Load'),
  //   mergeMap(() => from(this.db.read(this.db.collectionMap.articles))
  //     .pipe(
  //       map((userMap: UserMap) => userMapSuccess({ userMap }),
  //       catchError(() => 'EMPTY')
  //     )
  //   ))
  // ));
  

  // loadCurrentUser$ = createEffect(() => this.actions$.pipe(
  //   ofType('CurrentUser Load'),
  //   mergeMap(() => from(this.db.read(this.db.collectionMap.articles))
  //     .pipe(
  //       map(userMap => userMapSuccess({ userMap }),
  //       catchError(() => 'EMPTY')
  //     )
  //   ))
  // ));
}