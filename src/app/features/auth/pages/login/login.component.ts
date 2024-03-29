import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const {
      usernameOrEmail,
      password,
    } = form.value;
    
    this.isLoading = true;
    this.authService.login(usernameOrEmail, password).catch(
      error => {
        console.log('error', error);
        this.error = error.message;
        this.isLoading = false;
      }
    )

    // form.reset();
  }

}
