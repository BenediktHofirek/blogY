import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './features/auth/services/auth.service';
import { NavigationService } from './core/services/navigation.service';
import { appLoad } from './store/actions/app.actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private navigationService: NavigationService,
    private authService: AuthService,
    private store: Store) {}

  ngOnInit() {
    this.store.dispatch(appLoad());
  }
  title = 'blogY';
}
