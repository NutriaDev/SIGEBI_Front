import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ApiResponse,
  MaintenanceRequest,
  MaintenanceResponse,
  MaintenanceScheduleRequest,
  MaintenanceScheduleResponse,
  PageResponse,
} from '../models/model';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private readonly apiUrl = `${environment.apiUrl}/api/maintenance`;

  constructor(private http: HttpClient) {}

  // ── POST /maintenance ────────────────────────────────────────────────────
  registerMaintenance(
    request: MaintenanceRequest,
  ): Observable<ApiResponse<MaintenanceResponse>> {
    return this.http.post<ApiResponse<MaintenanceResponse>>(
      this.apiUrl,
      request,
    );
  }

  // ── POST /maintenance/schedule ───────────────────────────────────────────
  scheduleMaintenance(
    request: MaintenanceScheduleRequest,
  ): Observable<ApiResponse<MaintenanceScheduleResponse>> {
    return this.http.post<ApiResponse<MaintenanceScheduleResponse>>(
      `${this.apiUrl}/schedule`,
      request,
    );
  }

  // ── GET /maintenance ─────────────────────────────────────────────────────
  getMaintenanceHistory(
    equipmentId: number,
    fromDate: string,
    toDate: string,
    type?: string,
    page: number = 0,
    size: number = 10,
  ): Observable<ApiResponse<PageResponse<MaintenanceResponse>>> {
    let params = new HttpParams()
      .set('equipmentId', equipmentId.toString())
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('page', page.toString())
      .set('size', size.toString());

    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<ApiResponse<PageResponse<MaintenanceResponse>>>(
      this.apiUrl,
      { params },
    );
  }

  // ── GET /maintenance/overdue ─────────────────────────────────────────────
  getOverdueSchedules(
    page: number = 0,
    size: number = 10,
  ): Observable<ApiResponse<PageResponse<MaintenanceScheduleResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<
      ApiResponse<PageResponse<MaintenanceScheduleResponse>>
    >(`${this.apiUrl}/overdue`, { params });
  }
}
