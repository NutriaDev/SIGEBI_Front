import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/response';
import { PageResponse } from '../../../core/models/page-response';
import { AuditFilterRequest, AuditLogResponse } from '../models/audit.model';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly apiUrl = `${environment.apiUrl}/api/audit`;

  constructor(private http: HttpClient) {}

  getAuditLogs(
    filters: AuditFilterRequest,
  ): Observable<ApiResponse<PageResponse<AuditLogResponse>>> {
    return this.http.post<ApiResponse<PageResponse<AuditLogResponse>>>(
      `${this.apiUrl}/filters`,
      filters,
    );
  }
}
