import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
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
    private router: Router
  ) {}

  onLogin(): void {

    if (!this.username || !this.password) {
      this.errorMessage = 'Usuario y contraseña requeridos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials = {
      email: this.username,     // backend espera email
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Credenciales inválidas';
        console.error(err);
      }
    });
  }
}
