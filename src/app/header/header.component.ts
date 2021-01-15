import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import User from '../_models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public user: User | null = null;
  private userSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router) {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.user = user;
    });
  }
  
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
