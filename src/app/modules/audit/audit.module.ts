import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuditRoutingModule } from './audit-routing.module';
import { AuditLogsComponent } from './pages/audit-logs/audit-logs.component';

@NgModule({
  declarations: [AuditLogsComponent],
  imports: [SharedModule, AuditRoutingModule],
})
export class AuditModule {}
