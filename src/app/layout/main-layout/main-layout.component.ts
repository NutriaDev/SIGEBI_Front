import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TabService } from '../../modules/dashboard/services/tab.service';
import { UserEditComponent } from '../../modules/users/pages/user-edit/user-edit.component';
import { UserCreateComponent } from '../../modules/users/pages/user-create/user-create.component';
import { UserListComponent } from '../../modules/users/pages/user-list/user-list.component';
import { MaintenanceModule } from '../../modules/maintenance/maintenance.module';
import { ReportsModule } from '../../modules/reports/reports.module';
import { InventoryModule } from '../../modules/inventory/inventory.module';
import { EquipmentModule } from '../../modules/equipment/equipment.module';
import { EquipmentLifecycleComponent } from 'app/modules/equipment/pages/equipment-lifecycle/equipment-lifecycle.component';
import { AreaFormComponent } from 'app/modules/equipment/components/area-form/area-form.component';
import { ClasificationFormComponent } from 'app/modules/equipment/components/clasification-form/clasification-form.component';
import { StateFormComponent } from 'app/modules/equipment/components/state-form/state-form.component';
import { LocationFormComponent } from 'app/modules/equipment/components/location-form/location-form.component';
import { ProviderFormComponent } from 'app/modules/equipment/components/provider-form/provider-form.component';
import { EquipmentCreateComponent } from 'app/modules/equipment/pages/equipment-create/equipment-create.component';
import { EquipmentAllComponent } from 'app/modules/equipment/pages/equipment-all/equipment-all.component';
import { InventoryListComponent } from 'app/modules/inventory/pages/inventory-list/inventory-list.component';
import { MovementsListComponent } from 'app/modules/inventory/pages/movement-list/movement-list.component';
import { InventoryCreateComponent } from 'app/modules/inventory/components/inventory-create/inventory-create.component';

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
  inventoryMenuOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  has(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  hasAny(permissions: string[]): boolean {
    return this.authService.hasAnyPermission(permissions);
  }

  // Module equpiments
  equipmentMenuOpen = false;

  toggleEquipmentMenu() {
    this.equipmentMenuOpen = !this.equipmentMenuOpen;
  }

  openEquipment() {
    this.tabService.openTab(
      'Busqueda Avanzada HDV',
      EquipmentLifecycleComponent,
    );
    this.isSidebarOpen = false;
  }

  createEquipment() {
    this.tabService.openTab('Crear Equipos medicos', EquipmentCreateComponent);
  }

  getAllEquipment() {
    this.tabService.openTab('Equipos Médicos', EquipmentAllComponent);
  }

  openEquipmentArea() {
    this.tabService.openTab('Area de equipos', AreaFormComponent);
  }

  openEquipmentClassification() {
    this.tabService.openTab(
      'Clasificacion de equipos',
      ClasificationFormComponent,
    );
  }

  openEquipmentState() {
    this.tabService.openTab('Estado de un equipo', StateFormComponent);
  }

  openEquipmentLocation() {
    this.tabService.openTab('Ubicacion de un equipo', LocationFormComponent);
  }

  openEquipmentProvider() {
    this.tabService.openTab('Proveedores', ProviderFormComponent);
  }

  //Module Inventory

  toggleInventoryMenu(): void {
    this.inventoryMenuOpen = !this.inventoryMenuOpen;
  }

  openInventoryList() {
    this.tabService.openTab('Inventarios', InventoryListComponent);
    this.isSidebarOpen = false;
  }

  openMovementsList() {
    this.tabService.openTab('Movimientos', MovementsListComponent);
    this.isSidebarOpen = false;
  }

  createInvetory() {
    this.tabService.openTab('Crear inventario', InventoryCreateComponent);
    this.isSidebarOpen = false;
  }

  //maintenance

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

  openDeleteUser() {
    this.tabService.openTab('Eliminar Usuario', UserListComponent);
    this.isSidebarOpen = false;
  }
}
