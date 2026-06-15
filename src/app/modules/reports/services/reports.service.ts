import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ServiceReportRequest } from '../models/service-report-request.model';

@Injectable({ providedIn: 'root' })
export class ReportsService {

  private base = `${environment.apiUrl}/api/reports`;

  constructor(private http: HttpClient) {}

  // ── Service Report ──────────────────────────────────────────────
  createServiceReport(payload: ServiceReportRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/service-reports`, payload);
  }

  // ── Inventario ──────────────────────────────────────────────────
  getInventoryByLocation(locationId: number, page = 0, size = 10): Observable<any> {
    return this.http.get(`${this.base}/inventory/location/${locationId}`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  getInventoryByDateRange(from: string, to: string, page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to)
      .set('page', page)
      .set('size', size);
    return this.http.get(`${this.base}/inventory/date-range`, { params });
  }

  // ── Movimientos ─────────────────────────────────────────────────
  getMovementsByEquipment(equipmentId: number, page = 0, size = 10): Observable<any> {
    return this.http.get(`${this.base}/movement/equipment/${equipmentId}`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  getMovementsByDateRange(from: string, to: string, page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to)
      .set('page', page)
      .set('size', size);
    return this.http.get(`${this.base}/movement/date-range`, { params });
  }

  // ── Mantenimientos ──────────────────────────────────────────────
  getMaintenanceByEquipment(equipmentId: number, page = 0, size = 10): Observable<any> {
    return this.http.get(`${this.base}/maintenance/equipment/${equipmentId}`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  getMaintenanceByStatus(status: string, page = 0, size = 10): Observable<any> {
    return this.http.get(`${this.base}/maintenance/status/${status}`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  getMaintenanceByDateRange(from: string, to: string, page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to)
      .set('page', page)
      .set('size', size);
    return this.http.get(`${this.base}/maintenance/date-range`, { params });
  }

  // ── Consolidado ─────────────────────────────────────────────────
  getConsolidatedWithFilters(filters: {
    equipmentId?: number;
    physicalLocation?: string;
    maintenanceType?: string;
    maintenanceStatus?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
  }): Observable<any> {
    let params = new HttpParams()
      .set('page', filters.page ?? 0)
      .set('size', filters.size ?? 10);

    if (filters.equipmentId) params = params.set('equipmentId', filters.equipmentId);
    if (filters.physicalLocation) params = params.set('physicalLocation', filters.physicalLocation);
    if (filters.maintenanceType) params = params.set('maintenanceType', filters.maintenanceType);
    if (filters.maintenanceStatus) params = params.set('maintenanceStatus', filters.maintenanceStatus);
    if (filters.fromDate)    params = params.set('fromDate', filters.fromDate);
    if (filters.toDate)      params = params.set('toDate', filters.toDate);

    return this.http.get(`${this.base}/consolidated/filters`, { params });
  }

  downloadServiceReportByMaintenance(
  serviceReportId: number
): Observable<Blob> {

  return this.http.get(
    `${environment.apiUrl}/api/service-reports/${serviceReportId}/pdf`,
    {
      responseType: 'blob'
    }
  );
}
  
  // ── Snapshot ────────────────────────────────────────────────────
  getEquipmentSnapshot(equipmentId: number): Observable<any> {
    return this.http.get(`${this.base}/equipment-snapshot/${equipmentId}`);
  }

  getSnapshotsByLocation(locationId: number): Observable<any> {
    return this.http.get(`${this.base}/equipment-snapshot/location/${locationId}`);
  }

  // ── Exportación directa ─────────────────────────────────────────
  exportDirect(params: {
    type: 'INVENTORY' | 'MOVEMENTS' | 'MAINTENANCE' | 'AUDIT';
    from: string;
    to: string;
    format: 'CSV' | 'EXCEL' | 'PDF';
    equipmentId?: number;
    location?: string;
  }): Observable<Blob> {
    let httpParams = new HttpParams()
      .set('type', params.type)
      .set('from', params.from)
      .set('to', params.to)
      .set('format', params.format);

    if (params.equipmentId) httpParams = httpParams.set('equipmentId', params.equipmentId);
    if (params.location)    httpParams = httpParams.set('location', params.location);

    return this.http.get(`${this.base}/export-direct`, {
      params: httpParams,
      responseType: 'blob'
    });
  }
}