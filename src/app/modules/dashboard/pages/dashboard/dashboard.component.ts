import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: ` <router-outlet></router-outlet> `,
})
export class DashboardComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const roles = this.authService.getRoles();
    const role = roles && roles.length > 0 ? roles[0] : '';

    switch (role) {
      case 'SUPERADMIN':
        this.router.navigate(['dashboard/superadmin']);
        break;

      case 'ADMIN':
        this.router.navigate(['dashboard/admin']);
        break;

      case 'SUPERVISOR':
        this.router.navigate(['dashboard/supervisor']);
        break;

      case 'TECNICO':
        this.router.navigate(['dashboard/tecnico']);
        break;

      default:
        this.router.navigate(['/auth/login']);
        break;
    }
  }
}
