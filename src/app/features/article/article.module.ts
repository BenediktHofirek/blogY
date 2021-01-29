import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './article.component';

const routes: Routes = [
  {
    path: '',
    component: ArticleComponent
  }
]

@NgModule({
  declarations: [ArticleComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ArticleModule { }
