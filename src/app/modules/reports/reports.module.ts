import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ServiceReportCreateComponent } from './pages/service-report-create/service-report-create.component';

@NgModule({
  declarations: [ServiceReportCreateComponent],
  imports: [
    SharedModule,
    ReportsRoutingModule,
  ],
})
export class ReportsModule {}
