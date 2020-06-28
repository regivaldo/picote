import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public authFire: AngularFireAuth) { }

  login = () => {
    this.authFire.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout = () => {
    this.authFire.signOut();
  }
}
