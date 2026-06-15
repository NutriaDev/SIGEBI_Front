import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceListComponent } from './pages/maintenance-list/maintenance-list.component';
import { MaintenanceCreateComponent } from './pages/maintenance-create/maintenance-create.component';
import { MaintenanceScheduleComponent } from './pages/maintenance-schedule/maintenance-schedule.component';
import { MaintenanceOverdueComponent } from './pages/maintenance-overdue/maintenance-overdue.component';

const routes: Routes = [
  { path: '', component: MaintenanceListComponent },
  { path: 'create', component: MaintenanceCreateComponent },
  { path: 'schedule', component: MaintenanceScheduleComponent },
  { path: 'overdue', component: MaintenanceOverdueComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceRoutingModule {}
