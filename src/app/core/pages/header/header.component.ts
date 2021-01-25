import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from 'src/app/store/models/app.models';
import { AppState } from 'src/app/store/selectors/app.selector';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public user: User | null | undefined = undefined;
  private userSubscription: Subscription;

  constructor(private store: Store<AppState>,
              private router: Router,
              private authService: AuthService) {
    this.userSubscription = this.store.select((state: AppState) => state.currentUser)
      .subscribe(user => {
        if (Object.values(user).length) {
          this.user = user;
        } else {
          this.user = null;
        }
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
