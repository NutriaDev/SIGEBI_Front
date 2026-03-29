import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
})
export class ResetPasswordPageComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Leer el token de la URL: /auth/reset-password?token=UUID
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      Swal.fire({
        icon: 'error',
        title: 'Enlace inválido',
        text: 'El enlace de restablecimiento no es válido o ha expirado.',
        confirmButtonText: 'Ir al login',
        buttonsStyling: false,
        customClass: {
          popup: 'sigebi-popup',
          confirmButton: 'sigebi-confirm-btn',
        },
      }).then(() => {
        this.router.navigate(['/auth/login']);
      });
    }
  }

  onSubmit(): void {
    if (!this.newPassword || !this.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor completa todos los campos.',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false,
        customClass: {
          popup: 'sigebi-popup',
          confirmButton: 'sigebi-confirm-btn',
        },
      });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseñas no coinciden',
        text: 'La contraseña y su confirmación deben ser iguales.',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false,
        customClass: {
          popup: 'sigebi-popup',
          confirmButton: 'sigebi-confirm-btn',
        },
      });
      return;
    }

    this.loading = true;

    this.authService
      .resetPassword(this.token, this.newPassword, this.confirmPassword)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Contraseña restablecida!',
            text: 'Tu contraseña fue actualizada correctamente. Por favor inicia sesión.',
            confirmButtonText: 'Iniciar sesión',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          }).then(() => {
            this.router.navigate(['/auth/login']);
          });
        },
        error: (err) => {
          const message =
            err?.error?.message || 'El enlace es inválido o ha expirado.';

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });

          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
