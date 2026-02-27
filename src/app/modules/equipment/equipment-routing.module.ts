import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'lifecycle',
    loadComponent: () =>
      import('./pages/equipment-lifecycle/equipment-lifecycle.component').then(
        (c) => c.EquipmentLifecycleComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentRoutingModule {}
