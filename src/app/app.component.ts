import { Component } from '@angular/core';
import { AuthService } from './features/auth/services/auth.service';
import { NavigationService } from './core/services/navigation.service';

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
