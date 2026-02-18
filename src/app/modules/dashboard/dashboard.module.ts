import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardSuperadminComponent } from './role-dashboards/dashboard-superadmin/dashboard-superadmin.component';
import { DashboardAdminComponent } from './role-dashboards/dashboard-admin/dashboard-admin.component';
import { DashboardSupervisorComponent } from './role-dashboards/dashboard-supervisor/dashboard-supervisor.component';
import { DashboardTecnicoComponent } from './role-dashboards/dashboard-tecnico/dashboard-tecnico.component';
import { TabContainerComponent } from './components/tab-container/tab-container.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardSuperadminComponent,
    DashboardAdminComponent,
    DashboardSupervisorComponent,
    DashboardTecnicoComponent,
    TabContainerComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule],
})
export class DashboardModule {}
