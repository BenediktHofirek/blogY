import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './pages/account/account.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    AccountComponent,
    SettingsComponent,
    UserProfileComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
})
export class UserModule { }
