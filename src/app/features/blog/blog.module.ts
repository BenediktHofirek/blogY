import { NgModule } from '@angular/core';
import { BlogComponent } from './blog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent
  }
]

@NgModule({
  declarations: [BlogComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class BlogModule { }
