import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Area } from '../models/area';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private api = 'http://localhost:8080/api/equipments-area';

  constructor(private http: HttpClient) {}

  getAllAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.api}`);
  }

  updateArea(id: number, name: string): Observable<any> {
    return this.http.put(`${this.api}/${id}`, { name });
  }
}
