import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@shared/models/response.model';
import { Observable } from 'rxjs';

export class EquipmentService<T> {
  constructor(
    protected http: HttpClient,
    protected url: string,
  ) {}

  getAll(): Observable<ApiResponse<T[]>> {
    return this.http.get<ApiResponse<T[]>>(this.url);
  }

  getById(id: number): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.url}/${id}`);
  }

  getByName(name: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.url}/name/${name}`);
  }

  create(data: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.url, data);
  }

  update(id: number, data: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.url}/${id}`, data);
  }

  deactivate(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${this.url}/${id}/deactivate`,
      {},
    );
  }
}
