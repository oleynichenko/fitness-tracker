import {Injectable} from '@angular/core';
import {Route, CanLoad, Router} from '@angular/router';

import {AuthService} from './auth.service';

@Injectable()

export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService,
              private router: Router) {}

  canLoad(route: Route) {
    if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
