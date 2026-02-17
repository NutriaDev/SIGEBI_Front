import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../modules/auth/models';
import { HttpClient } from '@angular/common/http';
import { JwtDecoderService, JwtPayload } from './jwt-decoder.service';
import { TokenService } from './token.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<JwtPayload | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private jwtDecoderService: JwtDecoderService,
    private tokenService: TokenService,
    private logger: LoggerService,
  ) {
    this.initialize();
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.API}/login`, credentials).pipe(
      tap((response) => {
        // ✅ DIAGNÓSTICO - ver estructura real
        console.log('response:', JSON.stringify(response));
        console.log('response.body:', response.body);
        console.log('response.accessToken:', response.accessToken);
        console.log('response.body?.accessToken:', response.body?.accessToken);

        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;

        this.tokenService.saveAccessToken(accessToken);
        this.tokenService.saveRefreshToken(refreshToken);

        const payload = this.jwtDecoderService.decodeToken(accessToken);
        this.currentUserSubject.next(payload);
      }),
    );
  }

  logout() {
    this.currentUserSubject.next(null);
    this.tokenService.clear();
    this.logger.log('User logged out');
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getAccessToken();
  }

  getRoles(): string[] {
    const token = this.tokenService.getAccessToken();
    if (!token) return [];

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles || [];
    } catch (e) {
      return [];
    }
  }

  getPermissions(): string[] {
    return this.currentUserSubject.value?.permissions || [];
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((p) => this.getPermissions().includes(p));
  }

  private initialize(): void {
    const token = this.tokenService.getAccessToken();

    // ✅ Sin token - no hacer nada
    if (!token) return;

    // ✅ Token expirado - limpiar
    if (this.jwtDecoderService.isTokenExpired(token)) {
      console.warn('⚠️ Token expirado, limpiando sesión');
      this.tokenService.clear();
      return;
    }

    // ✅ Token válido - restaurar sesión
    const payload = this.jwtDecoderService.decodeToken(token);
    this.currentUserSubject.next(payload);
    console.log('✅ Sesión restaurada:', payload?.roles);
  }
}
