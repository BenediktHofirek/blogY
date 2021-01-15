import { Injectable } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";
import { BehaviorSubject, Observable } from 'rxjs';
import { NavigationService } from "./navigation.service";
import User from './_models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user: Observable<User | null> = this.userSubject.asObservable();

  constructor(private firebaseAuth: AngularFireAuth,
              private navigationService: NavigationService) {
    const user = localStorage.getItem('user');

    if (user) {
      const parsedUser = JSON.parse(user);
      
      if (parsedUser.expirationTime - Date.now() > 0) {
        this.userSubject.next(parsedUser);
      }
    }

    this.firebaseAuth.authState.subscribe(user => {
      if (user){
        console.log('user',user);
      }
    });
  }

  getCurrentUser() {
    const currentUser = this.userSubject.value;
    if (currentUser && currentUser.expirationTime - Date.now() > 0) {
      this.userSubject.next(null);
    }
    
    return this.userSubject.value;
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
  }

  setUser(userData: any) {
    console.log('userData',userData);
    const newUser: User = {
      email: userData.email,
      expirationTime: 100000000000000,
    }
    
    localStorage.setItem('user', JSON.stringify(newUser));
    this.userSubject.next(newUser);
  }
  
  //Create new user 
  register(email: string, password: string) {
    return new Promise<object | void>((resolve, reject) => { 
      this.firebaseAuth
        .createUserWithEmailAndPassword(email, password)
        .then(
          ({ user }) => {
            this.setUser(user)
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
          (data) => {
            console.log(data);
            this.setUser(data.user);
            this.navigationService.back();
            resolve();
          },
          (error) => { reject(error) }
        );
    });
  }

  singOut() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}