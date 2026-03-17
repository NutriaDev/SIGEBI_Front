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
    //Equipos
    [
      'Acquisition date cannot be in the future',
      'La fecha de adquisición no puede ser futura.',
    ],
    ['Serie is required', 'La serie es requerida.'],
    ['Name is required', 'El nombre es requerido.'],
    ['Brand is required', 'La marca es requerida.'],
    ['Model is required', 'El modelo es requerido.'],
    ['INVIMA code is required', 'El registro INVIMA es requerido.'],
    ['Acquisition date is required', 'La fecha de adquisición es requerida.'],
    ['Classification is required', 'La clasificación es requerida.'],
    ['Area is required', 'El área es requerida.'],
    ['Provider is required', 'El proveedor es requerido.'],
    ['State is required', 'El estado es requerido.'],
    ['Location is required', 'La ubicación es requerida.'],
    ['Responsible user is required', 'El usuario responsable es requerido.'],
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

  mapCreateEquipmentError(error: any): string {
    if (this.isConnectionError(error)) {
      return 'No se pudo conectar con el servidor.';
    }

    // Errores de validación con campos específicos
    const validationErrors = error?.error?.errors;
    if (validationErrors) {
      const fieldTranslations: Record<string, string> = {
        acquisitionDate: 'Fecha de adquisición',
        serie: 'Serie',
        name: 'Nombre',
        brand: 'Marca',
        model: 'Modelo',
        invima: 'Registro INVIMA',
        areaId: 'Área',
        stateId: 'Estado',
        locationId: 'Ubicación',
        classificationId: 'Clasificación',
        providerId: 'Proveedor',
        responsibleUserId: 'Usuario responsable',
      };

      return Object.entries(validationErrors)
        .map(([field, msg]) => {
          const fieldName = fieldTranslations[field] ?? field;
          const translated = this.translateBackendMessage(msg as string) ?? msg;
          return `• ${fieldName}: ${translated}`;
        })
        .join('\n');
    }

    switch (error.status) {
      case 400:
        return this.getBackendMessage(error) || 'Datos inválidos.';
      case 409:
        return (
          this.getBackendMessage(error) || 'Ya existe un equipo con esa serie.'
        );
      case 403:
        return 'No está autorizado para registrar equipos.';
      default:
        return 'Error inesperado al registrar el equipo.';
    }
  }

  mapUpdateEquipmentError(error: any): string {
    if (this.isConnectionError(error)) {
      return 'No se pudo conectar con el servidor.';
    }

    switch (error.status) {
      case 400:
        return this.getBackendMessage(error) || 'Datos inválidos.';
      case 404:
        return 'El equipo no existe.';
      case 409:
        return (
          this.getBackendMessage(error) || 'Ya existe un equipo con esa serie.'
        );
      case 403:
        return 'No está autorizado para actualizar equipos.';
      default:
        return 'Error inesperado al actualizar el equipo.';
    }
  }

  mapToggleEquipmentError(error: any, action: 'activar' | 'inactivar'): string {
    if (this.isConnectionError(error)) {
      return 'No se pudo conectar con el servidor.';
    }

    switch (error.status) {
      case 400:
        return (
          this.getBackendMessage(error) || `No se puede ${action} el equipo.`
        );
      case 404:
        return 'El equipo no existe.';
      case 403:
        return `No está autorizado para ${action} equipos.`;
      default:
        return `Error inesperado al ${action} el equipo.`;
    }
  }

  mapGetEquipmentError(error: any): string {
    if (this.isConnectionError(error)) {
      return 'No se pudo conectar con el servidor.';
    }

    switch (error.status) {
      case 404:
        return 'El equipo no existe.';
      case 403:
        return 'No está autorizado para consultar equipos.';
      default:
        return 'Error inesperado al consultar el equipo.';
    }
  }

  mapCreateProviderError(error: any): string {
    if (this.isConnectionError(error)) {
      return 'No se pudo conectar con el servidor.';
    }

    switch (error.status) {
      case 400:
        return this.getBackendMessage(error) || 'Datos inválidos.';
      case 403:
        return 'No tiene permisos para crear proveedores.';
      case 409:
        return this.getBackendMessage(error) || 'El proveedor ya existe.';
      case 500:
        return 'No tiene permisos para realizar esta acción.'; // 👈 cubre el bug del backend
      default:
        return 'Error inesperado.';
    }
  }
}
