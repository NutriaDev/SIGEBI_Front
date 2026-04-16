import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EquipmentService } from 'app/core/services/equipment.service';
import { BaseEntity } from 'app/core/models/base-equipments-entity';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/models/response.model';

@Injectable({ providedIn: 'root' })
export class LocationService extends EquipmentService<BaseEntity> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/locations');
  }

  getAllActive(): Observable<ApiResponse<BaseEntity[]>> {
    return this.http.get<ApiResponse<BaseEntity[]>>(`${this.url}/active/all`);
  }
}
