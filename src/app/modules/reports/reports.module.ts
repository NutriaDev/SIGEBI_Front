import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ServiceReportCreateComponent } from './pages/service-report-create/service-report-create.component';
import { ConsolidatedReportComponent } from './pages/consolidated-report/consolidated-report.component';
import { EquipmentLocationComponent } from './pages/equipment-location/equipment-location.component';
import { ExportReportButtonComponent } from './components/export-report-button/export-report-button.component';

@NgModule({
  declarations: [
    ServiceReportCreateComponent,
    ConsolidatedReportComponent,
    EquipmentLocationComponent,
    ExportReportButtonComponent,
  ],
  imports: [
    SharedModule,
    ReportsRoutingModule,
  ],
  exports: [
    ExportReportButtonComponent,
  ],
})
export class ReportsModule {}
