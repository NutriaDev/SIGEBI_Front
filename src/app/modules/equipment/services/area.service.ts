import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Area } from '../models/area';
import { CreateAreaRequest } from '../models/create-area-request';
import { PageResponse } from '../models/page-response';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private api = 'http://localhost:8080/api/equipments-area';

  constructor(private http: HttpClient) {}

  getAllAreas(): Observable<any> {
    return this.http.get<any>(`${this.api}`);
  }

  updateArea(id: number, name: string): Observable<any> {
    return this.http.put(`${this.api}/${id}`, { name });
  }

  createArea(request: CreateAreaRequest): Observable<any> {
    return this.http.post(this.api, request);
  }

  getAreaByName(name: string) {
    return this.http.get<any>(`${this.api}/name/${name}`);
  }

  getAreaById(id: number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }
}
