import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import * as moment from 'moment';
import { JwtHelperService as JwtHelper } from "@auth0/angular-jwt";
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { AppState } from 'src/app/store/selectors/app.selector';
import { NavigationService } from "../../../core/services/navigation.service";
import { Auth, LoginQueryGQL, LoginQueryQuery, RegisterMutationGQL } from 'src/app/graphql/graphql';
import { currentUserLoad, currentUserSuccess } from 'src/app/store/actions/app.actions';
import { User, Token } from 'src/app/store/models/app.models';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSubject: BehaviorSubject<string | object | null | undefined>;
  private tokenExpirationTime = 0;
  private jwtHelper;

  constructor(private store: Store<AppState>,
              private registerMutationGQL: RegisterMutationGQL,
              private loginQueryGQL: LoginQueryGQL,
              private apollo: Apollo,
              private navigationService: NavigationService,
              private router: Router) {
    this.jwtHelper = new JwtHelper();

    const tokenExpirationTime = +(localStorage.getItem("tokenExpirationTime") || 0);
    if (this.validateToken(tokenExpirationTime)) {
      this.tokenExpirationTime = tokenExpirationTime;
      const token = localStorage.getItem("token");
      this.tokenSubject = new BehaviorSubject<string | object | null | undefined>(token);

      if (token) {
        const userId = this.jwtHelper.decodeToken(token).sub;
        this.store.dispatch(currentUserLoad({ id: userId }));
      } else {
        this.store.dispatch(currentUserSuccess({ currentUser: { isLoading: false }}));
      }  
    } else {
      this.tokenSubject = new BehaviorSubject<string | object | null | undefined>(null);
      this.store.dispatch(currentUserSuccess({ currentUser: { isLoading: false }}));
    }
  }

  getTokenObservable() {
    return this.tokenSubject.asObservable();
  }

  getToken() {
    const token = this.tokenSubject.getValue();
    if (!this.validateToken(this.tokenExpirationTime) && token) {
      return null;
    }
    
    return token;
  }

  validateToken(tokenExpirationTime: number) {
    return moment(Date.now()).isBefore(moment(tokenExpirationTime * 1000));
  }
  
  //Create new user 
  register(email: string, password: string, username: string) {
    this.apollo.client.resetStore();
    return new Promise<object | void>((resolve, reject) => { 
      this.registerMutationGQL.mutate({
          email,
          username,
          password
      }).subscribe(
        (result) => {
          this.authCallback(result?.data?.register);
          resolve();
        },
          (error) => { reject(error) }
        );
    });
  }
  
  //Login user
  //user can provide username or email, both works,
  //while both are unique in database, 
  //so we can query condition "WHERE email = usernameOrEmail OR username = usernameOrEmail"
  login(
    usernameOrEmail: string,
    password: string
  ) {
    return new Promise<object | void>((resolve, reject) => { 
      this.loginQueryGQL.fetch({
        usernameOrEmail,
        password
    }).subscribe(
        (result) => {
          this.authCallback(result?.data?.login);
          resolve();
        },
        (error) => { reject(error) }
      );
    });
  }

  authCallback(data: any) {
    if (data) {
      const { user, token } : { user: User, token: string } = data;
      this.saveToken(token);
      this.store.dispatch(currentUserSuccess({ currentUser: user }));
      this.navigationService.back();
    }
  }

  saveToken(token: string) {
    const tokenExpirationTime = this.jwtHelper.decodeToken(token).exp;
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpirationTime', tokenExpirationTime);
    this.tokenSubject.next(token);
    this.tokenExpirationTime = tokenExpirationTime;
  }

  singOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("tokerExpirationTime");
    this.store.dispatch(currentUserSuccess({currentUser: {}}));
    this.tokenSubject.next(null);
    this.tokenExpirationTime = 0;
    this.router.navigateByUrl('/login');
  }
}