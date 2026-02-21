import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createUser(payload: any) {
    return this.http.post(`${this.baseUrl}/users-create`, payload);
  }
}
