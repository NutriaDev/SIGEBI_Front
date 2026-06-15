import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceReportCreateComponent } from './pages/service-report-create/service-report-create.component';
import { ConsolidatedReportComponent } from './pages/consolidated-report/consolidated-report.component';
import { EquipmentLocationComponent } from './pages/equipment-location/equipment-location.component';

const routes: Routes = [
  { path: 'service-report-create', component: ServiceReportCreateComponent },
  { path: 'consolidated', component: ConsolidatedReportComponent },
  { path: 'equipment-location', component: EquipmentLocationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
