import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { DashboardAdminComponent } from './role-dashboards/dashboard-admin/dashboard-admin.component';
import { DashboardSuperadminComponent } from './role-dashboards/dashboard-superadmin/dashboard-superadmin.component';
import { DashboardSupervisorComponent } from './role-dashboards/dashboard-supervisor/dashboard-supervisor.component';
import { DashboardTecnicoComponent } from './role-dashboards/dashboard-tecnico/dashboard-tecnico.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard], // 👈 AQUÍ SE QUEDA
    children: [
      { path: 'admin', component: DashboardAdminComponent },
      { path: 'superadmin', component: DashboardSuperadminComponent },
      { path: 'supervisor', component: DashboardSupervisorComponent },
      { path: 'tecnico', component: DashboardTecnicoComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
