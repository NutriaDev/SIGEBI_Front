import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private ACCESS = 'accessToken';
  private REFRESH = 'refreshToken';

  saveAccessToken(token: string) {
    localStorage.setItem(this.ACCESS, token);
  }

  saveRefreshToken(token: string) {
    localStorage.setItem(this.REFRESH, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH);
  }

  clear() {
    localStorage.removeItem(this.ACCESS);
    localStorage.removeItem(this.REFRESH);
  }
}
