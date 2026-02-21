import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { TabService } from '../../../dashboard/services/tab.service';
import { UserEditComponent } from '../user-edit/user-edit.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  constructor(
    private userService: AuthService,
    private tabService: TabService,
  ) {}
  users: any;

  openEditUser() {
    this.tabService.openTab('Editar Usuario', UserEditComponent);
  }
}
