import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { from } from 'rxjs';
import { AuthService } from '../auth.service';

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
      email,
      password,
    } = form.value;
    
    this.isLoading = true;
    this.authService.login(email, password).then(
      userData => {
        console.log('success', userData);
      },
      error => {
        console.log('error', error);
        this.error = error;
        this.isLoading = false;
      }
    )

    console.log(email, password);
    // form.reset();
  }

}
