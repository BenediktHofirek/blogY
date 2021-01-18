import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './features/auth/auth.module';
import { HomeModule } from './features/home/home.module';
import { UserModule } from './features/user/user.module';
import { MaterialModule } from './shared/modules/material-module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    AuthModule,
    CoreModule,
    HomeModule,
    SharedModule,
    UserModule,
    MaterialModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
