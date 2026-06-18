import { Component } from '@angular/core';
import { TabService } from '../../services/tab.service';
import { ReportsModule } from '../../../reports/reports.module';
import { EquipmentLifecycleComponent } from 'app/modules/equipment/pages/equipment-lifecycle/equipment-lifecycle.component';
import { ConsolidatedReportComponent } from 'app/modules/reports/pages/consolidated-report/consolidated-report.component';

@Component({
  selector: 'app-dashboard-tecnico',
  templateUrl: './dashboard-tecnico.component.html',
})
export class DashboardTecnicoComponent {
  constructor(private tabService: TabService) {}
  isSidebarOpen = false;

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
