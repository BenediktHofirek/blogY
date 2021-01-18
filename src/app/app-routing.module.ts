import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './features/user/pages/account/account.component';
import { AuthGuard } from './features/auth/services/auth-guard.service';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { PageNotFoundComponent } from './core/pages/page-not-found/page-not-found.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { SettingsComponent } from './features/user/pages/settings/settings.component';
import { UserProfileComponent } from './features/user/pages/user-profile/user-profile.component';

const routes: Routes = [
  { path: 'user/:userId', component: UserProfileComponent },
  { path: 'account', canActivate: [AuthGuard], component: AccountComponent },
  { path: 'settings', canActivate: [AuthGuard], component: SettingsComponent },
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
