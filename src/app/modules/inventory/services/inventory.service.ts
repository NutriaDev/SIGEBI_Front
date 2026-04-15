import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  InventoryFilters,
  InventoryResponse,
  InventoryWithDetailResponse,
  MovementFilters,
  MovementResponse,
  PagedResponse,
  CreateMovementPayload,
  UpdateEquipmentLocationPayload,
  CreateInventoryPayload,
} from '../models/model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly inventoryUrl = 'http://localhost:8080/api/inventories';
  private readonly movementsUrl = 'http://localhost:8080/api/movements';
  private readonly equipmentsUrl = 'http://localhost:8091/api/equipments';

  constructor(private http: HttpClient) {}

  // ─── Inventories ────────────────────────────────────────────────────────────

  getInventories(
    filters: InventoryFilters = {},
  ): Observable<PagedResponse<InventoryResponse>> {
    let params = new HttpParams()
      .set('page', filters.page ?? 0)
      .set('limit', filters.limit ?? 10);

    if (filters.date) params = params.set('date', filters.date);
    if (filters.locationId)
      params = params.set('locationId', filters.locationId);

    return this.http.get<PagedResponse<InventoryResponse>>(this.inventoryUrl, {
      params,
    });
  }

  getInventoryById(id: number): Observable<InventoryWithDetailResponse> {
    return this.http.get<InventoryWithDetailResponse>(
      `${this.inventoryUrl}/${id}`,
    );
  }

  createInventory(
    payload: CreateInventoryPayload,
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.inventoryUrl, payload);
  }

  // ─── Movements ──────────────────────────────────────────────────────────────

  getMovements(
    filters: MovementFilters = {},
  ): Observable<PagedResponse<MovementResponse>> {
    let params = new HttpParams()
      .set('page', filters.page ?? 0)
      .set('limit', filters.limit ?? 10);

    if (filters.equipmentId)
      params = params.set('equipmentId', filters.equipmentId);
    if (filters.locationId)
      params = params.set('locationId', filters.locationId);
    if (filters.date) params = params.set('date', filters.date);

    return this.http.get<PagedResponse<MovementResponse>>(this.movementsUrl, {
      params,
    });
  }

  createMovement(payload: CreateMovementPayload): Observable<MovementResponse> {
    return this.http.post<MovementResponse>(this.movementsUrl, payload);
  }

  // ─── Equipment location (PATCH) ─────────────────────────────────────────────

  updateEquipmentLocation(
    equipmentId: number,
    locationId: number,
  ): Observable<void> {
    const body: UpdateEquipmentLocationPayload = { locationId };
    return this.http.patch<void>(
      `${this.equipmentsUrl}/${equipmentId}/location`,
      body,
    );
  }
}
