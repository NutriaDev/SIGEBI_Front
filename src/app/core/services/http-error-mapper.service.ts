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
    if (!error || !error.status) {
      return 'Error inesperado.';
    }

    switch (error.status) {
      case 400:
        return error.error?.message || 'Datos inválidos.';

      case 409:
        return 'El correo ya está registrado.';

      case 403:
        return 'No tienes permisos para crear usuarios.';

      case 0:
        return 'No se pudo conectar con el servidor.';

      default:
        return 'Error inesperado.';
    }
  }

  mapUpdateUserError(error: any): string {
    if (!error || !error.status) {
      return 'Error inesperado.';
    }

    switch (error.status) {
      case 400:
        return error.error?.message || 'Datos inválidos.';

      case 409:
        return 'El correo ya está registrado.';

      case 403:
        return 'No tienes permisos para crear usuarios.';

      case 0:
        return 'No se pudo conectar con el servidor.';

      default:
        return 'Error inesperado.';
    }
  }

  mapDeleteUserError(error: any): string {
    if (!error || !error.status) {
      return 'Error inesperado.';
    }

    switch (error.status) {
      case 400:
        return error.error?.message || 'Datos inválidos.';

      case 409:
        return 'El correo ya está registrado.';

      case 403:
        return 'No tienes permisos para crear usuarios.';

      case 0:
        return 'No se pudo conectar con el servidor.';

      default:
        return 'Error inesperado.';
    }
  }

  mapGetAllUsersError(error: any): string {
    if (!error || !error.status) {
      return 'Error inesperado.';
    }

    switch (error.status) {
      case 400:
        return error.error?.message || 'Datos inválidos.';

      case 403:
        return 'No tienes permisos para realizar esta acción.';

      case 404:
        return 'No se encontró ningún usuario.';

      case 0:
        return 'No se pudo conectar con el servidor.';

      default:
        return 'Error inesperado.';
    }
  }
}
