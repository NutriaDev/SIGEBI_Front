import { Component } from '@angular/core';
import { TabService } from '../../services/tab.service';
import { ReportsModule } from '../../../reports/reports.module';

@Component({
  selector: 'app-dashboard-tecnico',
  templateUrl: './dashboard-tecnico.component.html',
})
export class DashboardTecnicoComponent {
  constructor(private tabService: TabService) {}

  openReports() {
    this.tabService.openTab('Reportes', ReportsModule);
  }
}
