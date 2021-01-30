import { NgModule } from '@angular/core';
import { EditorComponent } from './editor.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: EditorComponent
  }
]

@NgModule({
  declarations: [EditorComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class EditorModule { }