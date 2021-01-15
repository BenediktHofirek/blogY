import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import { NavigationService } from "./navigation.service";

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  public userObservable;
  private user: firebase.User | null = null;
  private expirationTime = 3600000;
  private userSubscription: Subscription;

  constructor(private firebaseAuth: AngularFireAuth,
              private navigationService: NavigationService,
              private router: Router) {
    this.userObservable = this.firebaseAuth.authState;
    this.userSubscription = this.firebaseAuth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  getCurrentUser() {
    if ((new Date(this.user?.metadata.lastSignInTime || 0).getTime() + this.expirationTime) - Date.now() > 0) {
      return this.user;
    }
    
    return null;
  }

  getToken(): Promise<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return new Promise(resolve => resolve(currentUser));
    }

    return currentUser.getIdToken();
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
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
    this.firebaseAuth.signOut().then(() => {
      this.router.navigateByUrl('/login');
    });
  }
}