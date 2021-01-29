import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentRoutingModule } from './content-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogComponent } from './pages/blog/blog.component';
import { ContentComponent } from './content.component';
import { ArticleComponent } from './pages/article/article.component';


@NgModule({
  declarations: [
    BlogComponent, 
    ArticleComponent, 
    ContentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ContentRoutingModule
  ]
})
export class ContentModule { }
