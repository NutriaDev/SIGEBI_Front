import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { UserViewComponent } from './pages/user-view/user-view.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserCreateComponent,
    UserEditComponent,
    UserViewComponent
  ],
  imports: [
    SharedModule,
    UsersRoutingModule,
  ],
})
export class UsersModule {}

//develop
