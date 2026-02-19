import { Component } from '@angular/core';
import { TabService } from '../../services/tab.service';
import { UserListComponent } from '../../../users/pages/user-list/user-list.component';
import { UserCreateComponent } from '../../../users/pages/user-create/user-create.component';
import { UserEditComponent } from '../../../users/pages/user-edit/user-edit.component';

@Component({
  selector: 'app-dashboard-superadmin',
  templateUrl: './dashboard-superadmin.component.html',
})
export class DashboardSuperadminComponent {
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
}
