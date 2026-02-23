import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipmentLifecycleComponent } from './pages/equipment-lifecycle/equipment-lifecycle.component';

const routes: Routes = [
  {
    path: 'equipment-lifecycle',
    component: EquipmentLifecycleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentRoutingModule {}
