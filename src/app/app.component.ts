import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private navigationService: NavigationService,
    private authService: AuthService) {}
  title = 'blogY';
}
