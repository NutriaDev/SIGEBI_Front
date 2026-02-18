import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent {
  constructor(public authService: AuthService) {}
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  has(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  hasAny(permissions: string[]): boolean {
    return this.authService.hasAnyPermission(permissions);
  }
}
