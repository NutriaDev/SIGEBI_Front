import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorMapperService {
  mapLoginError(error: any): string {
    switch (error.status) {
      case 401:
        return 'Correo o contraseña incorrectos.';
      case 403:
        return 'Tu cuenta está deshabilitada.';
      case 0:
        return 'No se pudo conectar con el servidor.';
      default:
        return 'Error inesperado.';
    }
  }

  mapCreateUserError(error: any): string {
    switch (error.status) {
      case 400:
        return 'El correo ya existe.';
      case 403:
        return 'Tu cuenta está deshabilitada.';
      case 0:
        return 'No se pudo conectar con el servidor.';
      default:
        return 'Error inesperado.';
    }
  }
}
