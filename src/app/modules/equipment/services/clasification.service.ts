import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EquipmentService } from 'app/core/services/equipment.service';
import { BaseEntity } from 'app/core/models/base-equipments-entity';
import { ApiResponse } from '@shared/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClasificationService extends EquipmentService<BaseEntity> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/classifications');
  }

  getActive(): Observable<ApiResponse<BaseEntity[]>> {
    return this.http.get<ApiResponse<BaseEntity[]>>(`${this.url}/active`);
  }
}
