import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CreateClasificationRequest } from '../models/create-clasification-request';

@Injectable({
  providedIn: 'root',
})
export class ClasificationService {
  private api = 'http://localhost:8080/api/classifications';

  constructor(private http: HttpClient) {}

  getAllClassifications(): Observable<any> {
    return this.http.get<any>(`${this.api}`);
  }

  updateClassifications(
    id: number,
    name: string,
    active?: boolean,
  ): Observable<any> {
    return this.http.put(`${this.api}/${id}`, {
      name,
      active,
    });
  }

  deactivateClassifications(id: number): Observable<any> {
    return this.http.patch(`${this.api}/${id}/deactivate`, {});
  }

  createClassifications(request: CreateClasificationRequest): Observable<any> {
    return this.http.post(this.api, request);
  }

  getClassificationByName(name: string) {
    return this.http.get<any>(`${this.api}/name/${name}`);
  }

  getClassificationById(id: number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }
}
