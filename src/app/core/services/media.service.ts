import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private url = 'http://localhost:8080/api/media'; // pasa por el gateway

  constructor(private http: HttpClient) {}

  getImage(equipmentId: number): Observable<any> {
    return this.http.get<any>(`${this.url}/equipment/${equipmentId}`);
  }

  uploadImage(equipmentId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(
      `${this.url}/equipment/${equipmentId}`,
      formData,
    );
  }

  deleteImage(equipmentId: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/equipment/${equipmentId}`);
  }
}
