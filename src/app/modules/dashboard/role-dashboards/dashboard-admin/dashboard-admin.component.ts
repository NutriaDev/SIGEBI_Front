import { Component } from '@angular/core';
import { TabService } from '../../services/tab.service';

// 👇 Importa componentes reales
import { UserListComponent } from '../../../users/pages/user-list/user-list.component';
import { UserCreateComponent } from '../../../users/pages/user-create/user-create.component';
import { UserEditComponent } from '../../../users/pages/user-edit/user-edit.component';
import { ReportsModule } from '../../../reports/reports.module';
import { EquipmentLifecycleComponent } from 'app/modules/equipment/pages/equipment-lifecycle/equipment-lifecycle.component';
import { ConsolidatedReportComponent } from 'app/modules/reports/pages/consolidated-report/consolidated-report.component';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
})
export class DashboardAdminComponent {
  constructor(private tabService: TabService) {}
  isSidebarOpen = false;

  openUsers() {
    this.tabService.openTab('Usuarios', UserListComponent);
  }

  openCreateUser() {
    this.tabService.openTab('Nuevo Usuario', UserCreateComponent);
  }

  openEditUser() {
    this.tabService.openTab('Editar Usuario', UserEditComponent);
  }

  consolidatedReport() {
      this.tabService.openTab(
        'Reporte Consolidado', ConsolidatedReportComponent);
      this.isSidebarOpen = false;}

  openEquipmentLifecycle() {
    this.tabService.openTab(
      'Ciclo de Vida del Equipo',
      EquipmentLifecycleComponent,
    );
  }
}
