import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

import {User} from './user.model';
import {AuthData} from './auth-data.model';
import {TrainingService} from '../training/training.service';
import {UiService} from '../shared/ui.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean;

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private uiService: UiService) {}

  isAuth() {
    return this.isAuthenticated;
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.router.navigate(['/training']);
        this.authChange.next(true);
      } else {
        this.trainingService.cancelSubscriptions();
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
        this.authChange.next(false);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    )
      .then(() => this.uiService.loadingStateChanged.next(false))
      .catch(err => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBar(err.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);

    this.afAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    )
      .then(() => this.uiService.loadingStateChanged.next(false))
      .catch(err => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBar(err.message, null, 3000);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
