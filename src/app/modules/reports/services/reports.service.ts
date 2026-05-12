import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ServiceReportRequest } from '../models/service-report-request.model';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  constructor(private http: HttpClient) {}

  createServiceReport(payload: ServiceReportRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/service-reports`, payload);
  }
}
