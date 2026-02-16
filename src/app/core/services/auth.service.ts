import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.prod";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { LoginRequest, LoginResponse } from "../../modules/auth/models";
import { HttpClient } from "@angular/common/http";
import { JwtDecoderService, JwtPayload } from "./jwt-decoder.service";
import { TokenService } from "./token.service";
import { LoggerService } from "./logger.service";


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<JwtPayload | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    
    constructor(
        private http: HttpClient,
        private jwtDecoderService: JwtDecoderService,
        private tokenService: TokenService,
        private logger: LoggerService  
    ) {
        this.initialize();
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.API}/login`, credentials)
    .pipe(
      tap(response => {
        this.tokenService.saveAccessToken(response.accessToken);
        this.tokenService.saveRefreshToken(response.refreshToken);

        const payload = this.jwtDecoderService.decodeToken(response.accessToken);
        this.currentUserSubject.next(payload);
      })
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
       return this.currentUserSubject.value?.roles || [];
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