import { NgModule } from '@angular/core';

//base
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppStoreModule } from './app-store.module';

//apollo
import { APOLLO_OPTIONS } from "apollo-angular";
import { InMemoryCache } from "@apollo/client/core";
import { ApolloLink } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

//app modules
import { CoreModule } from './core/core.module';
import { AuthModule } from './features/auth/auth.module';
import { HomeModule } from './features/home/home.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './features/user/user.module';
import { HttpHeaders } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    AppStoreModule,
    AuthModule,
    CoreModule,
    HomeModule,
    SharedModule,
    UserModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        const http = httpLink.create({uri: "http://localhost:3000/graphql"});
        const middleware = new ApolloLink((operation, forward) => {
          operation.setContext({
            headers: new HttpHeaders().set(
              'Authorization',
              `Bearer ${localStorage.getItem('token')}`,
            ),
          });
          return forward(operation);
        });

        const link = middleware.concat(http);

        return {
          link,
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
