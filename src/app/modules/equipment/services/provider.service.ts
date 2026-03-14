import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseEntity } from 'app/core/models/base-equipments-entity';
import { EquipmentService } from 'app/core/services/equipment.service';

@Injectable({
  providedIn: 'root',
})
export class ProviderService extends EquipmentService<BaseEntity> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/providers');
  }
}
