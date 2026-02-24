import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorMapperService {
  private backendTranslations: Map<string, string> = new Map<string, string>([
    ['El correo ya está registrado.', 'El correo ya está registrado.'],
    [
      'Superadmin cannot be deactivated.',
      'El superadministrador no puede ser desactivado.',
    ],
    [
      'Superadmin cannot be deleted.',
      'El superadministrador no puede ser eliminado.',
    ],
    ['User not found.', 'El usuario no existe.'],
    ['Email already exists.', 'El correo ya existe.'],
    [
      'User must be deactivated before deletion.',
      'El usuario debe ser desactivado antes de ser eliminado.',
    ],
    [
      'User must be at least 18 years old',
      'El usuario debe tener al menos 18 años.',
    ],
    ['Phone number already exists', 'El número de teléfono ya existe.'],
  ]);

  private translateBackendMessage(message: string | null): string | null {
    if (!message) return null;

    return this.backendTranslations.get(message) || message;
  }

  private getBackendMessage(error: any): string | null {
    const message = error?.error?.message || null;
    return this.translateBackendMessage(message);
  }
  private isConnectionError(error: any): boolean {
    return error?.status === 0;
  }

  mapLoginError(error: any): string {
    if (this.isConnectionError(error)) {
      return 'No se pudo conectar con el servidor.';
    }

    switch (error.status) {
      case 401:
        return 'Correo o contraseña incorrectos.';
      case 403:
        return 'Tu cuenta está deshabilitada.';
      default:
        return this.getBackendMessage(error) || 'Error inesperado.';
    }
  }

  mapCreateUserError(error: any): string {
    if (this.isConnectionError(error)) {
      return 'No se pudo conectar con el servidor.';
    }

    switch (error.status) {
      case 400:
        return this.getBackendMessage(error) || 'Datos inválidos.';
      case 409:
        return this.getBackendMessage(error) || 'El correo ya está registrado.';
      case 403:
        return 'No está autorizado para crear usuarios.';
      default:
        return 'Error inesperado.';
    }
  }

  mapUpdateUserError(error: any): string {
    if (this.isConnectionError(error)) {
      return 'No se pudo conectar con el servidor.';
    }

    switch (error.status) {
      case 400:
        return this.getBackendMessage(error) || 'Datos inválidos.';
      case 401:
        return 'Sesión expirada. Inicie sesión nuevamente.';
      case 403:
        return 'No está autorizado para realizar esta acción.';
      case 404:
        return 'El usuario no existe.';
      default:
        return 'Error inesperado.';
    }
  }

  mapDeleteUserError(error: any): string {
    if (this.isConnectionError(error)) {
      return 'No se pudo conectar con el servidor.';
    }

    switch (error.status) {
      case 400:
        return (
          this.getBackendMessage(error) || 'No se puede eliminar el usuario.'
        );
      case 403:
        return 'No está autorizado para eliminar usuarios.';
      case 404:
        return 'El usuario no existe.';
      default:
        return 'Error inesperado.';
    }
  }

  mapDeactivateUserError(error: any): string {
    if (this.isConnectionError(error)) {
      return 'No se pudo conectar con el servidor.';
    }

    switch (error.status) {
      case 400:
        return (
          this.getBackendMessage(error) ||
          'No se puede cambiar el estado del usuario.'
        );
      case 403:
        return 'No está autorizado para cambiar el estado del usuario.';
      case 404:
        return 'El usuario no existe.';
      default:
        return 'Error inesperado.';
    }
  }

  mapGetUserByIdError(error: any): string {
    if (this.isConnectionError(error)) {
      return 'No se pudo conectar con el servidor.';
    }

    switch (error.status) {
      case 403:
        return 'No está autorizado para realizar esta acción.';
      case 404:
        return 'El usuario no existe.';
      default:
        return this.getBackendMessage(error) || 'Error inesperado.';
    }
  }

  mapGetUserByEmailError(error: any): string {
    if (this.isConnectionError(error)) {
      return 'No se pudo conectar con el servidor.';
    }

    switch (error.status) {
      case 403:
        return 'No está autorizado para realizar esta acción.';
      case 404:
        return 'El usuario no existe.';
      case 400:
        return this.getBackendMessage(error) || 'Correo inválido.';
      default:
        return 'Error inesperado.';
    }
  }

  mapGetAllUsersError(error: any): string {
    if (this.isConnectionError(error)) {
      return 'No se pudo conectar con el servidor.';
    }

    switch (error.status) {
      case 403:
        return 'No está autorizado para consultar usuarios.';
      default:
        return 'Error inesperado.';
    }
  }
}
