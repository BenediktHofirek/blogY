import { Injectable } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";
import { NavigationService } from "./navigation.service";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user: any = null;

  constructor(private firebaseAuth: AngularFireAuth,
              private navigationService: NavigationService) {
    // this.firebaseAuth.authState.subscribe(user => {
    //   if (user){
    //     this.user = user;
    //     console.log('user',user);
    //     localStorage.setItem('user', JSON.stringify(user));
    //   } else {
    //     this.user = null;
    //     localStorage.removeItem('user');
    //   }
    // });
  }

  getCurrentUser() {
    return this.user;
  }
  
  //Create new user 
  register(email: string, password: string) {
    return new Promise<object | void>((resolve, reject) => { 
      this.firebaseAuth
        .createUserWithEmailAndPassword(email, password)
        .then(
          (user) => {
            this.user = user;
            this.sendVerificationEmail();
            this.navigationService.back();
            resolve();
          },
          (error) => { reject(error) }
        );
    });
  }

  sendVerificationEmail() {
  }
  
  
  //Login user
  login(email: string, password: string) {
    return new Promise<object | void>((resolve, reject) => { 
      this.firebaseAuth
        .signInWithEmailAndPassword(email, password)
        .then(
          (user) => {
            this.user = user;
            this.navigationService.back();
            resolve();
          },
          (error) => { reject(error) }
        );
    });
  }

  singOut() {
    this.firebaseAuth.signOut();
  }
}