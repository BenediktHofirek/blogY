import { Injectable } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private firebaseAuth: AngularFireAuth) { }

  isAuthenticated() {
    return new Promise((res) => setTimeout(() => res(true), 1000));
  }
  
  //Create new user 
  register(email: string, password: string) {
    return this.firebaseAuth
        .createUserWithEmailAndPassword(email, password);
  }
  
  
  //Login user
  login(email: string, password: string) {
    return this.firebaseAuth
        .signInWithEmailAndPassword(email, password);
  }
}