import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/users.model';
import { SnackbarService } from './snackbar.service';

export type CreateUserRequest = {
  displayName: string;
  password: string;
  email: string;
  role: string;
};
export type UpdateUserRequest = { uid: string } & CreateUserRequest;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = `${environment.functionsBaseUrl}/api/users`;
  constructor(private http: HttpClient, private snackBarService: SnackbarService) {}

  get users$(): Observable<User[]> {
    return this.http.get<{ users: User[] }>(`${this.baseUrl}`).pipe(
      map((result) => {
        return result.users;
      }),
      catchError((error) => {
        this.snackBarService.showSnackbar(error.error, 'Ok', 'error');
        return EMPTY;
      })
    );
  }

  user$(id: string): Observable<User> {
    return this.http.get<{ user: User }>(`${this.baseUrl}/${id}`).pipe(
      map((result) => {
        return result.user;
      }),
      catchError((error) => {
        this.snackBarService.showSnackbar(error.error, 'Ok', 'error');
        return EMPTY;
      })
    );
  }

  create(user: CreateUserRequest) {
    return this.http.post(`${this.baseUrl}`, user);
  }

  edit(user: UpdateUserRequest) {
    return this.http.patch(`${this.baseUrl}/${user.uid}`, user);
  }
}
