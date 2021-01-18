import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import firebase from 'firebase';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public user: firebase.User | null | undefined = undefined;
  private userSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router) {
    this.userSubscription = this.authService.userSubject.subscribe(user => {
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
