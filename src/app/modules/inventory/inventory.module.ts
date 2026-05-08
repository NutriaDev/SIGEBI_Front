import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { InventoryRoutingModule } from './inventory-routing.module';

import { MovementsListComponent } from './pages/movement-list/movement-list.component';
import { InventoryListComponent } from './pages/inventory-list/inventory-list.component';
import { MovementCreateComponent } from './components/movement-create/movement-create.component';
import { InventoryCreateComponent } from './components/inventory-create/inventory-create.component';

@NgModule({
  declarations: [
    MovementsListComponent,
    InventoryListComponent,
    MovementCreateComponent,
    InventoryCreateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InventoryRoutingModule,

    // Angular Material
    MatSelectModule,
    MatFormFieldModule,
  ],
})
export class InventoryModule {}
