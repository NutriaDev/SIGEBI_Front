import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../modules/auth/models';
import { HttpClient } from '@angular/common/http';
import { JwtDecoderService, JwtPayload } from './jwt-decoder.service';
import { TokenService } from './token.service';
import { LoggerService } from './logger.service';
import { Router } from '@angular/router';

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
    private router: Router,
  ) {
    this.initialize();
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http
      .post<any>(`${this.API}/login`, credentials, {
        headers: {
          'Skip-Auth-Redirect': 'true',
        },
      })
      .pipe(
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
    this.router.navigate(['/auth/login']);
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

  get currentUser() {
    return this.currentUserSubject.value;
  }

  private initialize(): void {
    const token = this.tokenService.getAccessToken();

    if (!token) {
      return;
    }

    if (this.jwtDecoderService.isTokenExpired(token)) {
      this.tokenService.clear();
      return;
    }

    const payload = this.jwtDecoderService.decodeToken(token);

    if (!payload) {
      return;
    }

    this.currentUserSubject.next(payload);
  }
}
