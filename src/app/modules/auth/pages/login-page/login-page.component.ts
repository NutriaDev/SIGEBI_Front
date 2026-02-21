import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpErrorMapperService } from '../../../../core/services/http-error-mapper.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  roles: string[] = ['Administrador', 'Técnico', 'Supervisor', 'Auditor'];
  selectedRole = '';
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private errorMapper: HttpErrorMapperService,
  ) {}

  onLogin(): void {
    if (!this.username || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Usuario y contraseña requeridos',
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

    const credentials = {
      email: this.username,
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const message = this.errorMapper.mapLoginError(err);

        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: message,
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });

        this.loading = false;

        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
