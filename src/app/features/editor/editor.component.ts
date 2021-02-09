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

  viewArticle() {
    window.open(`${window.location.origin}/user/${this.userUsername}/blog/${this.blogName}/article/${this.articleName}`,'_blank');
  }

  handleIsPublishedChange() {
    const isPublished = !this.article.isPublished;
    this.article = {
      ...this.article,
      isPublished,
    }

    this.handleSave({ isPublished });
  }


  handleAllowCommentsChange() {
    const allowComments = !this.article.allowComments;
    this.article = {
      ...this.article,
      allowComments,
    }

    this.handleSave({ allowComments });
  }

  handleTitleSave(newTitle: string) {
    this.isTitleChanged = false;
    this.handleSave({name: newTitle});

    this.router.navigate(['/user',this.userUsername, 'blog', this.blogName, 'article', newTitle, 'edit']);
  }

  handleSaveSource(source: any) {
    this.handleSave({ source });
  }

  handleSave(payload: any) {
    this.apollo.mutate({
      mutation: articleUpdateMutation,
      variables: {
        id: this.article.id,
        ...payload,
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
