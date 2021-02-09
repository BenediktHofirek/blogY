import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { AppState, User } from 'src/app/store/models/app.models';
import { Article } from '../../core/models/models';
import { articleQuery, articleUpdateMutation } from './graphql';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  article: Article;
  userUsername: any;
  blogName: any;
  articleName: any;
  isLoading = true;
  userSubscription: Subscription;
  user: User | null;
  isTitleChanged = false;

  constructor(private route: ActivatedRoute,
              private store: Store,
              private router: Router,
              private apollo: Apollo) {
    this.userSubscription = this.store.select((state: any) => state.currentUser)
      .subscribe(user => {
        if (!user.isLoading) {
          if (user.id) {
            this.user = user;
          } else {
            this.user = null;
          }
        }
      });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.userUsername = params.username;
      this.blogName = params.blogName;
      this.articleName = params.articleName;
    });

    this.apollo.query({
      query: articleQuery,
      variables: {
        blogName: this.blogName,
        articleName: this.articleName,
        username: this.userUsername,
      }
    }).subscribe(
      ({ data }: {data: any}) => {
        this.article = data.article;
        this.isLoading = false;
      },
      (err) => console.log('error', err)
    );
  }

  showPreview() {
    window.open(`${window.location.origin}/user/${this.userUsername}/blog/${this.blogName}/article/${this.articleName}`,'_blank');
  }

  handleTitleSave(newTitle: string) {
    this.isTitleChanged = false;
    this.apollo.mutate({
      mutation: articleUpdateMutation,
      variables: {
        id: this.article.id,
        name: newTitle,
      }
    }).subscribe(
      (result: any) => {
        console.log('name change success', result?.data?.articleUpdate);
      },
      (err) => console.log('error', err)
    );

    this.router.navigate(['/user',this.userUsername, 'blog', this.blogName, 'article', newTitle, 'edit']);
  }

  handleSave(source: any) {
    console.log('source', source);
    this.apollo.mutate({
      mutation: articleUpdateMutation,
      variables: {
        id: this.article.id,
        source,
      }
    }).subscribe(
      (result: any) => {
        this.article = result?.data?.articleUpdate;
      },
      (err) => console.log('error', err)
    );
  }

  isUserAllowed() {
    return this.user?.username === this.article?.author.username;
  }
}
