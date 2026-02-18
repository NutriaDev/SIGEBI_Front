import { Component, Type } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TabService } from '../../modules/dashboard/services/tab.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent {
  constructor(
    public authService: AuthService,
    private tabService: TabService,
  ) {}
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

  openTab(title: string, component: Type<any>) {
    this.tabService.openTab(title, component);
  }
}
