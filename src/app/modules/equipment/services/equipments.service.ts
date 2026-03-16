// equipments.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// el genérico
import { Equipment } from '../models/equipment';
import { ApiResponse } from '@shared/models/response.model';
import { Observable } from 'rxjs';
import { EquipmentService } from 'app/core/services/equipment.service';

@Injectable({ providedIn: 'root' })
export class EquipmentsService extends EquipmentService<Equipment> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/equipments');
  }

  // Métodos propios de equipos
  getActive(pageable?: any): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(`${this.url}/active`, {
      params: pageable,
    });
  }

  getBySerie(serie: string): Observable<ApiResponse<Equipment>> {
    return this.http.get<ApiResponse<Equipment>>(`${this.url}/serie/${serie}`);
  }

  getByArea(id: number, pageable?: any): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(`${this.url}/area/${id}`, {
      params: pageable,
    });
  }

  getByClassification(
    id: number,
    pageable?: any,
  ): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(
      `${this.url}/classification/${id}`,
      { params: pageable },
    );
  }

  getByProvider(
    id: number,
    pageable?: any,
  ): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(
      `${this.url}/provider/${id}`,
      { params: pageable },
    );
  }

  getByState(id: number, pageable?: any): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(`${this.url}/state/${id}`, {
      params: pageable,
    });
  }

  getByLocation(
    id: number,
    pageable?: any,
  ): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(
      `${this.url}/location/${id}`,
      { params: pageable },
    );
  }

  search(name: string, pageable?: any): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(`${this.url}/search`, {
      params: { name, ...pageable },
    });
  }
}
