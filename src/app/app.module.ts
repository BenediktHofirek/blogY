import { NgModule } from '@angular/core';

//base
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppStoreModule } from './app-store.module';

//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

//app modules
import { CoreModule } from './core/core.module';
import { AuthModule } from './features/auth/auth.module';
import { HomeModule } from './features/home/home.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './features/user/user.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './features/auth/services/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AuthModule,
    CoreModule,
    HomeModule,
    SharedModule,
    UserModule,
    AppRoutingModule,
    AppStoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
