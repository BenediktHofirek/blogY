import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './pages/account/account.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { SettingsComponent } from './pages/settings/settings.component';



@NgModule({
  declarations: [
    AccountComponent,
    SettingsComponent,
    UserProfileComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
