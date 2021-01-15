import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountInfoComponent } from './account/account-info/account-info.component';
import { AccountSettingsComponent } from './account/account-settings/account-settings.component';
import { AuthGuard } from './auth-guard.service';
import { ArticleComponent } from './blog/article/article.component';
import { BlogComponent } from './blog/blog.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: 'user/:userId', component: UserComponent },
  { path: 'user', component: UserComponent },
  { path: 'blog', component: BlogComponent, children: [
    { path: ':blogId', component: BlogComponent },
    { path: ':blogId/article/:articleId', component: ArticleComponent },
  ] },
  { path: 'account', canActivate: [AuthGuard], component: AccountInfoComponent, children: [
    { path: 'info', component: AccountInfoComponent },
    { path: 'info/:action', component: AccountInfoComponent },
    { path: 'settings', component: AccountSettingsComponent },
    { path: 'settings/:action', component: AccountSettingsComponent },
  ]},
  { path: 'login', canActivate: [AuthGuard], component: LoginComponent },
  { path: 'register', canActivate: [AuthGuard], component: RegisterComponent },
  { path: '', component: HomeComponent },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
