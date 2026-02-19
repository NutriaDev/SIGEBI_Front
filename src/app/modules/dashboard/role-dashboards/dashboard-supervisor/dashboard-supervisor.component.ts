import { Component } from '@angular/core';
import { TabService } from '../../services/tab.service';
import { UserListComponent } from '../../../users/pages/user-list/user-list.component';

@Component({
  selector: 'app-dashboard-supervisor',
  templateUrl: './dashboard-supervisor.component.html',
})
export class DashboardSupervisorComponent {
  constructor(private tabService: TabService) {}

  openUsers() {
    this.tabService.openTab('Usuarios', UserListComponent);
  }
}
