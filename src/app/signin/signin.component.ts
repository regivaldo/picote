import { Component, OnInit } from '@angular/core';
import { auth } from 'firebase/app';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  constructor(private authService: AuthService) { }

  login = () => {
    this.authService.login();
  }

  logout = () => {
    this.authService.logout();
  }

  hasAutenticated = () => {
    return this.authService.authFire.user;
  }
}
