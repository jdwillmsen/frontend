import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject, Observable, from, switchMap } from 'rxjs';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<Observable<unknown> | null> =
    new BehaviorSubject<Observable<unknown> | null>(null);

  user$ = this.user.asObservable().pipe(switchMap((user: any) => user));

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private snackBarService: SnackbarService
  ) {
    this.user.next(this.angularFireAuth.authState);
  }

  emailAuth(email: string, password: string): Observable<unknown> {
    return from(
      this.angularFireAuth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          this.snackBarService.showSnackbar(
            'Login Successful',
            'Ok',
            'success',
            3000
          );
          this.router.navigate(['home']);
        })
        .catch((error) => {
          this.snackBarService.showSnackbar(error.message, 'Ok', 'error');
        })
    );
  }

  // Google Sign In
  googleAuth(): Observable<unknown> {
    return from(this.authLogin(new GoogleAuthProvider()));
  }

  authLogin(provider: GoogleAuthProvider | never): Observable<unknown> {
    return from(
      this.angularFireAuth
        .signInWithPopup(provider)
        .then(() => {
          this.snackBarService.showSnackbar(
            'Login Successful',
            'Ok',
            'success',
            3000
          );
          this.router.navigate(['home']);
        })
        .catch((error) => {
          this.snackBarService.showSnackbar(error.message, 'Ok', 'error');
        })
    );
  }

  authLogout(): Observable<void> {
    return from(
      this.angularFireAuth.signOut().then(() => {
        this.snackBarService.showSnackbar(
          'Logout Successful',
          'Ok',
          'success',
          3000
        );
        this.router.navigate(['sign-in']);
      })
    );
  }
}
