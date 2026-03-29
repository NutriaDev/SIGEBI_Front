import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
})
export class ForgotPasswordPageComponent {
  email = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (!this.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor ingresa tu correo electrónico',
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

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        }).then(() => {
          this.router.navigate(['/auth/login']);
        });
      },
      error: () => {
        // Respuesta genérica — no revelar si el email existe
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        }).then(() => {
          this.router.navigate(['/auth/login']);
        });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/auth/login']);
  }
}
