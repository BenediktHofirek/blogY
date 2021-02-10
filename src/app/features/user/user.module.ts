import { NgModule } from '@angular/core';
import { AccountComponent } from './pages/account/account.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { InputDialogComponent } from './components/input-dialog/input-dialog.component';
import { ImageUploadDialogComponent } from './components/image-upload-dialog/image-upload-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'account', component:  AccountComponent},
      { path: 'blogs', component:  BlogsComponent},
      { path: 'messages', component: MessagesComponent},
      { path: '', redirectTo: '/not-found', pathMatch: 'full' }
    ],
  }
];

@NgModule({
  declarations: [
    AccountComponent,
    BlogsComponent,
    MessagesComponent,
    UserComponent,
    InputDialogComponent,
    ImageUploadDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class UserModule { }
