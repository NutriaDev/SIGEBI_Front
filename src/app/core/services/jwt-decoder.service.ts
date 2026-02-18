import { Injectable } from '@angular/core';

export interface JwtPayload {
    sub: string;
    sessionId: string;
    roles: string[];
    permissions: string[];
    iat: number;
    exp: number;
}

@Injectable({
    providedIn: 'root'
})
export class JwtDecoderService {

    decodeToken(token: string): JwtPayload | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    }

    getUserId(token: string): string | null {
        const payload = this.decodeToken(token);
        return payload ? payload.sub : null;
    }

    getSessionId(token: string): string | null {
        const payload = this.decodeToken(token);
        return payload ? payload.sessionId : null;
    }

    getRoles(token: string): string[] {
        const payload = this.decodeToken(token);
        return payload ? payload.roles : [];
    }

    getPermissions(token: string): string[] {
        const payload = this.decodeToken(token);
        return payload ? payload.permissions : [];
    }

    isTokenExpired(token: string): boolean {
        const payload = this.decodeToken(token);
        if (!payload) return true;
        
        const expirationDate = new Date(payload.exp * 1000);
        return expirationDate < new Date();
    }

}