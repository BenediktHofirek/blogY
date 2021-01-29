import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './content.component';
import { ArticleComponent } from './pages/article/article.component';
import { BlogComponent } from './pages/blog/blog.component';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [
      {
        path: ':blogName/article/:articleName',
        component: ArticleComponent,
      },
      {
        path: ':blogName',
        component: BlogComponent,
      },
      {
        path: '**',
        redirectTo: '/not-found'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
