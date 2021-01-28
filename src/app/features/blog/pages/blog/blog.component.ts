import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { articleListQuery, blogQuery } from '../../graphql';
import { Article, Blog } from '../../../../core/models/models';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articleList: [Article];
  blog: Blog;
  userUsername: any;
  blogName: any;

  constructor(private route: ActivatedRoute,
              private apollo: Apollo) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.userUsername = params.username;
      this.blogName = params.blogName;
    });

    this.apollo.query({
      query: blogQuery,
      variables: {
        blogName: this.blogName,
        username: this.userUsername,
      }
    }).subscribe(
      ({ data }: {data: any}) => {
        this.blog = data.blog;     
      },
      (err) => console.log('error', err)
    );
  }

}
