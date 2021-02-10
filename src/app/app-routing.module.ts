import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './features/auth/services/auth-guard.service';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { PageNotFoundComponent } from './core/pages/page-not-found/page-not-found.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';

const routes: Routes = [
  { 
    path: 'user/:username/blog/:blogName/article/:articleName/edit',
    canActivate: [AuthGuard],
    loadChildren: async () => (await import('./features/editor/editor.module')).EditorModule 
  },
  { 
    path: 'user/:username/blog/:blogName/article/:articleName', 
    loadChildren: async () => (await import('./features/article/article.module')).ArticleModule 
  },
  { 
    path: 'user/:username/blog/:blogName', 
    loadChildren: async () => (await import('./features/blog/blog.module')).BlogModule 
  },
  { 
    path: 'user/:username',
    canActivate: [AuthGuard],
    loadChildren: async () => (await import('./features/user/user.module')).UserModule 
  },
  { path: 'login', canActivate: [AuthGuard], component: LoginComponent },
  { path: 'register', canActivate: [AuthGuard], component: RegisterComponent },
  { path: '', component: HomeComponent },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
