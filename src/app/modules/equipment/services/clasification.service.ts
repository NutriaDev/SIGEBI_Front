import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EquipmentService } from 'app/core/services/equipment.service';
import { BaseEntity } from 'app/core/models/base-equipments-entity';

@Injectable({
  providedIn: 'root',
})
export class ClasificationService extends EquipmentService<BaseEntity> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/classifications');
  }
}
