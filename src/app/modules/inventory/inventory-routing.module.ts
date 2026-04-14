import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryListComponent } from './pages/inventory-list/inventory-list.component';
import { MovementsListComponent } from './pages/movement-list/movement-list.component';

const routes: Routes = [
  { path: '', component: InventoryListComponent },
  { path: 'movimientos', component: MovementsListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
