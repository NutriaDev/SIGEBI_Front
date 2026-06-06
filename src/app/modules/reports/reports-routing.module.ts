import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceReportCreateComponent } from './pages/service-report-create/service-report-create.component';
import { ConsolidatedReportComponent } from './pages/consolidated-report/consolidated-report.component';

const routes: Routes = [
  { path: 'service-report-create', component: ServiceReportCreateComponent },
  { path: 'consolidated', component: ConsolidatedReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
