import { Component } from '@angular/core';
import { TabService } from '../../services/tab.service';
import { UserListComponent } from '../../../users/pages/user-list/user-list.component';
import { ReportsModule } from '../../../reports/reports.module';

@Component({
  selector: 'app-dashboard-supervisor',
  templateUrl: './dashboard-supervisor.component.html',
})
export class DashboardSupervisorComponent {
  constructor(private tabService: TabService) {}

  openUsers() {
    this.tabService.openTab('Usuarios', UserListComponent);
  }

  openReports() {
    this.tabService.openTab('Reportes', ReportsModule);
  }
}
