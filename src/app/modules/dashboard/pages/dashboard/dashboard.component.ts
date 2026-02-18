import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  role: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const roles = this.authService.getRoles();
    this.role = roles && roles.length > 0 ? roles[0] : '';
  }

  is(roleName: string): boolean {
    return this.role === roleName;
  }
}
