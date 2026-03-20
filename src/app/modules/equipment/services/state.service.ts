import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@shared/models/response.model';
import { BaseEntity } from 'app/core/models/base-equipments-entity';
import { EquipmentService } from 'app/core/services/equipment.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService extends EquipmentService<BaseEntity> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/states');
  }

  getActive(): Observable<ApiResponse<BaseEntity[]>> {
    return this.http.get<ApiResponse<BaseEntity[]>>(`${this.url}/active`);
  }
}
