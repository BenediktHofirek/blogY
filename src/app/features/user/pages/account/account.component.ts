import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public user: firebase.User | null | undefined;

  constructor(private authService: AuthService,
              private router: Router) {
    this.user = authService.getCurrentUser();
    console.log(this.user);
    if (!this.user) {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit(): void {
  }

}
