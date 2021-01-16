import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";
import { Router } from '@angular/router';
import firebase from 'firebase';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { NavigationService } from "./navigation.service";

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  public userSubject: BehaviorSubject<firebase.User | null | undefined>;
  private expirationTime = 3600000;
  private userSubscription: Subscription;
  private isSingedOut = false;

  constructor(private firebaseAuth: AngularFireAuth,
              private navigationService: NavigationService,
              private router: Router) {
    this.userSubject = new BehaviorSubject<firebase.User | null | undefined>(undefined);
    this.userSubscription = this.firebaseAuth.authState.subscribe((user) => {
      this.isSingedOut = false;
      if (this.validateUser(user)) {
        this.userSubject.next(user);
      } else {
        this.userSubject.next(null);
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  validateUser(user: firebase.User | null | undefined): boolean {
    return (new Date(user?.metadata.lastSignInTime || 0).getTime() + this.expirationTime) - Date.now() > 0
  }

  getCurrentUser() {
    const currentUser = this.isSingedOut ? null : this.userSubject.getValue();
    if (this.validateUser(currentUser)) {
      return currentUser;
    }
    
    return currentUser;
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
    console.log('beforeLogout');
    this.firebaseAuth.signOut().then(() => {
      this.isSingedOut = true;
      this.router.navigateByUrl('/login');
    });
  }
}