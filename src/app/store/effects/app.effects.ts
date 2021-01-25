import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Apollo } from 'apollo-angular';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ArticlesQueryGQL, BlogsQueryGQL, UserQueryGQL, UsersQueryGQL } from 'src/app/graphql/graphql';
import { articleMapLoad, articleMapSuccess, blogMapLoad, blogMapSuccess, currentUserSuccess, userMapLoad, userMapSuccess } from '../actions/app.actions';
 
@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private apollo: Apollo,
    private articlesQueryGQL: ArticlesQueryGQL,
    private blogsQueryGQL: BlogsQueryGQL,
    private usersQueryGQL: UsersQueryGQL,
    private userQueryGQL: UserQueryGQL,
  ) {}
  
  loadApp$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[App] Load'),
      mergeMap(() => [
        articleMapLoad(),
        blogMapLoad(),
        userMapLoad(),
      ])
    )
  );

  loadArticleMap$ = createEffect(() => this.actions$.pipe(
    ofType('ArticleMap Load'),
    mergeMap(() => 
      this.articlesQueryGQL.fetch()
      .pipe(
        map((result) => {
          const articleMap: any = {};
          result.data.articles?.forEach((article) => {
            if (article) {
              articleMap[`${article.id}`] = article;
            }
          });
          return articleMapSuccess({ articleMap });
        },
        catchError(() => 'EMPTY')
      )
    ))
  ));

  loadBlogMap$ = createEffect(() => this.actions$.pipe(
    ofType('BlogMap Load'),
    mergeMap(() => 
      this.blogsQueryGQL.fetch()
      .pipe(
        map((result) => {
          const blogMap: any = {};
          result.data.blogs?.forEach((blog) => {
            if (blog) {
              blogMap[`${blog.id}`] = blog;
            }
          });
          return blogMapSuccess({ blogMap });
        },
        catchError(() => 'EMPTY')
      )
    ))
  ));

  loadUserMap$ = createEffect(() => this.actions$.pipe(
    ofType('UserMap Load'),
    mergeMap(() => 
      this.usersQueryGQL.fetch()
      .pipe(
        map((result) => {
          const userMap: any = {};
          result.data.users?.forEach((user) => {
            if (user) {
              userMap[`${user.id}`] = user;
            }
          });
          return userMapSuccess({ userMap });
        },
        catchError(() => 'EMPTY')
      )
    ))
  ));

  loadCurrentUser$ = createEffect(() => this.actions$.pipe(
    ofType('CurrentUser Load'),
    mergeMap((loadAction: any) => 
      this.userQueryGQL.fetch({ id: `${loadAction.id}` })
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