import {User} from './user.model';
import {Subject} from 'rxjs';
import {AuthData} from './auth-data.model';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;

  constructor(private router: Router) {}

  isAuth() {
    return this.user != null;
  }

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };

    this.authSuccessfully();
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };

    this.authSuccessfully();
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  authSuccessfully() {
    this.router.navigate(['/training']);
    this.authChange.next(true);
  }
}
