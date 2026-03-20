import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EquipmentService } from 'app/core/services/equipment.service';
import { BaseEntity } from 'app/core/models/base-equipments-entity';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class AreaService extends EquipmentService<BaseEntity> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/equipments-area');
  }

  // area.service.ts, state.service.ts, location.service.ts,
  // clasification.service.ts, provider.service.ts — mismo patrón en todos

  getActive(): Observable<ApiResponse<BaseEntity[]>> {
    return this.http.get<ApiResponse<BaseEntity[]>>(`${this.url}/active`);
  }
}
