import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TabService } from '../../modules/dashboard/services/tab.service';
import { UserEditComponent } from '../../modules/users/pages/user-edit/user-edit.component';
import { UserCreateComponent } from '../../modules/users/pages/user-create/user-create.component';
import { UserListComponent } from '../../modules/users/pages/user-list/user-list.component';
import { ServiceReportCreateComponent } from '../../modules/reports/pages/service-report-create/service-report-create.component';
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
import { MaintenanceCreateComponent } from 'app/modules/maintenance/pages/maintenance-create/maintenance-create.component';
import { MaintenanceListComponent } from 'app/modules/maintenance/pages/maintenance-list/maintenance-list.component';
import { MaintenanceScheduleComponent } from 'app/modules/maintenance/pages/maintenance-schedule/maintenance-schedule.component';
import { MaintenanceOverdueComponent } from 'app/modules/maintenance/pages/maintenance-overdue/maintenance-overdue.component';
import { ConsolidatedReportComponent } from 'app/modules/reports/pages/consolidated-report/consolidated-report.component';
import { EquipmentLocationComponent } from 'app/modules/reports/pages/equipment-location/equipment-location.component';

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
  equipmentMenuOpen = false;
  inventoryMenuOpen = false;
  maintenanceMenuOpen = false;
  reportMenuOpen = false;

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

  openEquipmentLocation() {
    this.tabService.openTab('Buscar Ubicacion', EquipmentLocationComponent);
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

  openEquipmentLocations() {
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

  //module maintenance

  toggleMaintenanceMenu() {
    this.maintenanceMenuOpen = !this.maintenanceMenuOpen;
  }

  createMaintenance() {
    this.tabService.openTab(
      'Registrar mantenimiento',
      MaintenanceCreateComponent,
    );
    this.isSidebarOpen = false;
  }

  scheduleMaintenance() {
    this.tabService.openTab(
      'Programar Mantenimiento',
      MaintenanceScheduleComponent,
    );
    this.isSidebarOpen = false;
  }

  listMaintenance() {
    this.tabService.openTab('Mantenimientos', MaintenanceListComponent);
    this.isSidebarOpen = false;
  }

  overdueMaintenance() {
    this.tabService.openTab('Alertas', MaintenanceOverdueComponent);
    this.isSidebarOpen = false;
  }

  //reports and audit

  toggleReportMenu() {
    this.reportMenuOpen = !this.reportMenuOpen;
  }

  consolidatedReport() {
    this.tabService.openTab(
      'Reporte Consolidado', ConsolidatedReportComponent);
    this.isSidebarOpen = false;}

  

  //users

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
