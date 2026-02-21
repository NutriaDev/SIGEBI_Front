import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ApiResponse } from '@shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createUser(payload: any) {
    return this.http.post(`${this.baseUrl}/users-create`, payload);
  }

  getAllUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/get-all-users`);
  }

  updateUser(payload: any) {
    return this.http.put(`${this.baseUrl}/update-user`, payload);
  }

  deleteUser(payload: any) {
    return this.http.delete(`${this.baseUrl}/users-delete`, payload);
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(
      `${this.baseUrl}/get-user-by-id/${id}`,
    );
  }

  getUserByEmail(email: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(
      `${this.baseUrl}/get-user-by-email/${email}`,
    );
  }
}
