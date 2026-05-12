import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceReportCreateComponent } from './pages/service-report-create/service-report-create.component';

const routes: Routes = [
  { path: 'service-report-create', component: ServiceReportCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
