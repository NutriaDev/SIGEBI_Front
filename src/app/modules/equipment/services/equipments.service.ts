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

  getByArea(
    name: string,
    pageable?: any,
  ): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(`${this.url}/area`, {
      params: { name, ...pageable },
    });
  }

  getByClassification(
    name: string,
    pageable?: any,
  ): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(
      `${this.url}/classification`,
      {
        params: { name, ...pageable },
      },
    );
  }

  getByProvider(
    name: string,
    pageable?: any,
  ): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(`${this.url}/provider`, {
      params: { name, ...pageable },
    });
  }

  getByState(
    name: string,
    pageable?: any,
  ): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(`${this.url}/state`, {
      params: { name, ...pageable },
    });
  }

  getByLocation(
    name: string,
    pageable?: any,
  ): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(`${this.url}/location`, {
      params: { name, ...pageable },
    });
  }

  search(name: string, pageable?: any): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(`${this.url}/search`, {
      params: { name, ...pageable },
    });
  }

  activate(id: number): Observable<ApiResponse<void>> {
    // 👈 agregar aquí
    return this.http.patch<ApiResponse<void>>(`${this.url}/${id}/activate`, {});
  }
}
