import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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
      username,
    } = form.value;
    
    this.isLoading = true;
    this.authService.register(email, password, username).catch(
      error => {
        console.log('error', error);
        this.error = error.message;
        this.isLoading = false;
      }
    )

    console.log(email, password, username);
    // form.reset();
  }

}
