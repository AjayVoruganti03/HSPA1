import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertifyService } from '../../services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  // Corrected to styleUrls
})
export class LoginComponent {
  constructor(private authService: AuthService,
              private alertify: AlertifyService, 
              private router: Router) {}

  ngOnInit() {}

  onLogin(loginForm: NgForm) {
    console.log(loginForm.value);
    const token = this.authService.authUser(loginForm.value);
    if (token) {
      localStorage.setItem('token', token.token);
      console.log('Token stored:', token.token); 
      this.alertify.success('Login successful');
      this.router.navigate(['/']);
    } else {
      this.alertify.error('Login failed: Invalid username or password');
    }
  }
}
