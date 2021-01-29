import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Article } from '../../core/models/models';
import { articleQuery } from './graphql';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article: Article;
  userUsername: any;
  blogName: any;
  articleName: any;

  constructor(private route: ActivatedRoute,
              private apollo: Apollo) { }

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
      },
      (err) => console.log('error', err)
    );
  }

}
