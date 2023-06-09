import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, catchError, map } from 'rxjs';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class UserFormService {

  constructor(private snackBarService: SnackbarService) {}

  private _behaviorSubject = new BehaviorSubject<{title: string, user: any}>({ title: '', user: {} });

  edit(user: any) {
    this._behaviorSubject.next({ title: 'Edit User', user });
  }

  create() {
    this._behaviorSubject.next({ title: 'Create User', user: null });
  }

  get title$() {
    return this._behaviorSubject.asObservable().pipe(
      map((userForm) => userForm.title),
      catchError((error) => {
        this.snackBarService.showSnackbar(error.error, 'Ok', 'error');
        return EMPTY;
      })
    );
  }

  get user$() {
    return this._behaviorSubject.asObservable().pipe(
      map(userForm => userForm.user),
      catchError((error) => {
        this.snackBarService.showSnackbar(error.error, 'Ok', 'error');
        return EMPTY;
      })
    );
  }

}
