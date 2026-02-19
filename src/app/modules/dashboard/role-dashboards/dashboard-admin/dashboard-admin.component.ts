import { Component } from '@angular/core';
import { TabService } from '../../services/tab.service';

// 👇 Importa componentes reales
import { UserListComponent } from '../../../users/pages/user-list/user-list.component';
import { UserCreateComponent } from '../../../users/pages/user-create/user-create.component';
import { UserEditComponent } from '../../../users/pages/user-edit/user-edit.component';
import { ReportsModule } from '../../../reports/reports.module';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
})
export class DashboardAdminComponent {
  constructor(private tabService: TabService) {}

  openUsers() {
    this.tabService.openTab('Usuarios', UserListComponent);
  }

  openCreateUser() {
    this.tabService.openTab('Nuevo Usuario', UserCreateComponent);
  }

  openEditUser() {
    this.tabService.openTab('Editar Usuario', UserEditComponent);
  }

  openReports() {
    this.tabService.openTab('Reportes', ReportsModule);
  }
}
