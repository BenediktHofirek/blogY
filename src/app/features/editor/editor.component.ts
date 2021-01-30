import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import Quill from 'quill';
import { Subscription } from 'rxjs';
import { AppState, User } from 'src/app/store/models/app.models';
import { Article } from '../../core/models/models';
import { articleQuery, articleUpdateMutation } from './graphql';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditorComponent implements OnInit {
  article: Article;
  userUsername: any;
  blogName: any;
  articleName: any;
  isLoading: boolean;
  userSubscription: Subscription;
  user: User | null;
  editor: Quill;
  isContentChanged = false;

  @ViewChild('editor', {
    static: true
  }) editorRef: any;

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
        if (this.isUserAllowed()) {
          this.initEditor();
        }
      },
      (err) => console.log('error', err)
    );
  }

  initEditor() {
    this.editor = new Quill(this.editorRef?.nativeElement, {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        
          ['blockquote', 'code-block'],
        
          [{ 'header': 1 }, { 'header': 2 }],               
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],      
          [{ 'indent': '-1'}, { 'indent': '+1' }],         
          [{ 'direction': 'rtl' }],                        
        
          [{ 'size': ['small', 'normal', 'large', 'huge'] }],  
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        
          [{ 'color': [] }, { 'background': [] }],        
          [{ 'font': [] }],
          [{ 'align': [] }],     
          ['image', 'code-block', 'link']                               
        ],
        history: {
          delay: 0,
          maxStack: 1000,
          userOnly: false
        },
      },
      placeholder: 'Write something...',
      theme: 'snow'
    });
    
    if (this.article.source) {
      this.editor.setContents(<any>this.article.source);
    }

    this.editor.on('text-change', () => {
      this.isContentChanged = true;
    });
  }

  handleSave() {
    this.isContentChanged = false;
    const source = this.editor.getContents();
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
