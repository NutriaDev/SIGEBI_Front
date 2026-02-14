import { Component } from '@angular/core';

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

  onLogin(): void {
    console.log('Login attempt:', {
      role: this.selectedRole,
      username: this.username,
    });
    // TODO: wire to AuthService
  }
}
