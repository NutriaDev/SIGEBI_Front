import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
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

  private initialize() {
    const token = this.tokenService.getAccessToken();

    if (token && !this.jwtDecoderService.isTokenExpired(token)) {
      const payload = this.jwtDecoderService.decodeToken(token);
      this.currentUserSubject.next(payload);
    } else {
      this.tokenService.clear();
    }
  }
}
