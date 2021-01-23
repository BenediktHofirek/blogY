import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { AppState } from 'src/app/store/selectors/app.selector';
import { NavigationService } from "../../../core/services/navigation.service";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private jwtSubject: BehaviorSubject<string | object | null | undefined>;
  private tokenExpirationTime = 0;

  constructor(private store: Store<AppState>,
              private navigationService: NavigationService,
              private router: Router) {
    this.tokenExpirationTime = +(localStorage.getItem("tokenExpirationTime") || 0);
    this.jwtSubject = new BehaviorSubject<string | object | null | undefined>(localStorage.getItem("jwt"));
  }

  getJwtTokenObservable() {
    return this.jwtSubject.asObservable();
  }

  getJwtToken() {
    const jwt = this.jwtSubject.getValue();
    if (!this.validateToken() && jwt) {
      return null;
    }
    
    return jwt;
  }

  validateToken() {
    return moment(Date.now()).isBefore(moment(this.tokenExpirationTime));
  }
  
  //Create new user 
  register(email: string, password: string, username: string) {
    return new Promise<object | void>((resolve, reject) => { 
      this.firebaseAuth
        .createUserWithEmailAndPassword(email, password)
        .then(
          ({ user }) => {
            if (user) {
              user.sendEmailVerification();
              user.updateProfile({
                displayName: username,
              }).then(() => {
                this.navigationService.back();
                resolve();
              }).catch((error) => reject(error));
            }
          },
          (error) => { reject(error) }
        );
    });
  }
  
  //Login user
  login(email: string, password: string) {
    return new Promise<object | void>((resolve, reject) => { 
      this.firebaseAuth
        .signInWithEmailAndPassword(email, password)
        .then(
          ({ user }) => {
            if (user) {
              this.navigationService.back();
            }
            resolve();
          },
          (error) => { reject(error) }
        );
    });
  }

  singOut() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("tokerExpirationTime");
    this.jwtSubject.next(null);
    this.expirationTime = 0;
    this.router.navigateByUrl('/login');
  }
}