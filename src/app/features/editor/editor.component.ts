import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Quill } from 'quill';
import { Subscription } from 'rxjs';
import { AppState, User } from 'src/app/store/models/app.models';
import { Article } from '../../core/models/models';
import { articleQuery } from './graphql';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  article: Article;
  userUsername: any;
  blogName: any;
  articleName: any;
  isLoading: boolean;
  userSubscription: Subscription;
  user: User | null;

  @ViewChild('editor', {
    static: true
  }) editor: any;

  constructor(private route: ActivatedRoute,
              private store: Store,
              private apollo: Apollo) {
    this.isLoading = true;
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

    // const quill = new Quill(this.editor, {
    //   modules: {
    //     toolbar: [
    //       [{ header: [1, 2, false] }],
    //       ['bold', 'italic', 'underline'],
    //       ['image', 'code-block']
    //     ]
    //   },
    //   placeholder: 'Compose an epic...',
    //   theme: 'snow'  // or 'bubble'
    // });
  }

  isUserAllowed() {
    console.log('allowing', this.user?.username, this.article?.author.username, this.user?.username === this.article?.author.username);
    return this.user?.username === this.article?.author.username;
  }
}
