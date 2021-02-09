import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import moment from 'moment';
import { Article, Blog } from 'src/app/core/models/models';
import { blogQuery } from './graphql';

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
              private router: Router,
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

  formatDate(date: string) {
    return moment(date).format('DD. MMMM YYYY');
  }

  navigateToUser() {
    this.router.navigateByUrl(`/user/${this.blog?.author?.username}`);
  }

}
