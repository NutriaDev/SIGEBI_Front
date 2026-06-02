import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceCreateComponent } from './pages/maintenance-create/maintenance-create.component';
import { MaintenanceScheduleComponent } from './pages/maintenance-schedule/maintenance-schedule.component';
import { MaintenanceListComponent } from './pages/maintenance-list/maintenance-list.component';
import { MaintenanceOverdueComponent } from './pages/maintenance-overdue/maintenance-overdue.component';

import { ReportsModule } from '../reports/reports.module';

@NgModule({
  declarations: [
    MaintenanceCreateComponent,
    MaintenanceScheduleComponent,
    MaintenanceListComponent,
    MaintenanceOverdueComponent,
  ],
  imports: [SharedModule, MaintenanceRoutingModule, ReportsModule],
})
export class MaintenanceModule {}
