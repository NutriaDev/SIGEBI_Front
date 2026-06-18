import { Component } from '@angular/core';
import { TabService } from '../../services/tab.service';
import { UserListComponent } from '../../../users/pages/user-list/user-list.component';
import { ReportsModule } from '../../../reports/reports.module';
import { EquipmentLifecycleComponent } from 'app/modules/equipment/pages/equipment-lifecycle/equipment-lifecycle.component';
import { ConsolidatedReportComponent } from 'app/modules/reports/pages/consolidated-report/consolidated-report.component';

@Component({
  selector: 'app-dashboard-supervisor',
  templateUrl: './dashboard-supervisor.component.html',
})
export class DashboardSupervisorComponent {
  constructor(private tabService: TabService) {}
  isSidebarOpen = false;

  openUsers() {
    this.tabService.openTab('Usuarios', UserListComponent);
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
