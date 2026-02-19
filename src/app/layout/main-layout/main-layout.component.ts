import { Component, Type } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TabService } from '../../modules/dashboard/services/tab.service';
import { UserEditComponent } from '../../modules/users/pages/user-edit/user-edit.component';
import { UserCreateComponent } from '../../modules/users/pages/user-create/user-create.component';
import { UserListComponent } from '../../modules/users/pages/user-list/user-list.component';
import { MaintenanceModule } from '../../modules/maintenance/maintenance.module';
import { ReportsModule } from '../../modules/reports/reports.module';
import { InventoryModule } from '../../modules/inventory/inventory.module';
import { EquipmentModule } from '../../modules/equipment/equipment.module';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
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

  openEquipment() {
    this.tabService.openTab('Equipos Médicos', EquipmentModule);
    this.isSidebarOpen = false;
  }

  openInventory() {
    this.tabService.openTab('Inventarios', InventoryModule);
    this.isSidebarOpen = false;
  }

  openMaintenance() {
    this.tabService.openTab('Mantenimiento', MaintenanceModule);
    this.isSidebarOpen = false;
  }

  openReports() {
    this.tabService.openTab('Reportes', ReportsModule);
    this.isSidebarOpen = false;
  }

  openUsers() {
    this.tabService.openTab('Usuarios', UserListComponent);
    this.isSidebarOpen = false;
  }

  openCreateUser() {
    this.tabService.openTab('Nuevo Usuario', UserCreateComponent);
    this.isSidebarOpen = false;
  }

  openEditUser() {
    this.tabService.openTab('Editar Usuario', UserEditComponent);
    this.isSidebarOpen = false;
  }
}
