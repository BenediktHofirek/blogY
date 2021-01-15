import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import firebase from 'firebase';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public user: firebase.User | null = null;
  private userSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router) {
    this.userSubscription = this.authService.userObservable.subscribe(user => {
      console.log('user', user);
      this.user = user;
    });
  }
  
  ngOnInit(): void {
  }

  singOut() {
    this.authService.singOut();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
