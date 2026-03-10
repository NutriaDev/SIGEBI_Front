import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { EquipmentRoutingModule } from './equipment-routing.module';
import { AreaFormComponent } from './components/area-form/area-form.component';
import { ClasificationFormComponent } from './components/clasification-form/clasification-form.component';
import { StateFormComponent } from './components/state-form/state-form.component';
import { LocationFormComponent } from './components/location-form/location-form.component';
import { ProviderFormComponent } from './components/provider-form/provider-form.component';

@NgModule({
  declarations: [
    AreaFormComponent,
    ClasificationFormComponent,
    StateFormComponent,
    LocationFormComponent,
    ProviderFormComponent
  ],
  imports: [SharedModule, EquipmentRoutingModule],
})
export class EquipmentModule {}
