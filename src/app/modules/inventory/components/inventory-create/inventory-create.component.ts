import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory-create',
  templateUrl: './inventory-create.component.html',
})
export class InventoryCreateComponent {
  inventoryForm: FormGroup;
  loading = false;

  readonly states = ['BUENO', 'REGULAR', 'MALO', 'DADO_DE_BAJA'];

  readonly roles = ['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'TECNICO'];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
  ) {
    this.inventoryForm = this.fb.group({
      location: ['', Validators.required],
      locationId: ['', [Validators.required, Validators.min(1)]],
      date: [''],
      observations: [''],
      createdBy: ['', [Validators.required, Validators.min(1)]],
      userRole: ['', Validators.required],
      details: this.fb.array([this.newDetail()]),
    });
  }

  // ─── FormArray helpers ───────────────────────────────────────────────────────

  get details(): FormArray {
    return this.inventoryForm.get('details') as FormArray;
  }

  newDetail(): FormGroup {
    return this.fb.group({
      equipmentId: ['', [Validators.required, Validators.min(1)]],
      state: ['', Validators.required],
      observations: [''],
    });
  }

  addDetail(): void {
    this.details.push(this.newDetail());
  }

  removeDetail(index: number): void {
    if (this.details.length > 1) {
      this.details.removeAt(index);
    }
  }

  // ─── Submit ──────────────────────────────────────────────────────────────────

  submit(): void {
    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos obligatorios.',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false,
        customClass: {
          popup: 'sigebi-popup',
          confirmButton: 'sigebi-confirm-btn',
        },
      });
      return;
    }

    const v = this.inventoryForm.value;

    const payload = {
      location: v.location,
      locationId: Number(v.locationId),
      date: v.date || null,
      observations: v.observations || null,
      createdBy: Number(v.createdBy),
      userRole: v.userRole,
      details: v.details.map((d: any) => ({
        equipmentId: Number(d.equipmentId),
        state: d.state,
        observations: d.observations || null,
      })),
    };

    this.loading = true;

    this.inventoryService.createInventory(payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Inventario creado',
          text: res.message ?? 'El inventario fue registrado correctamente.',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });

        this.inventoryForm.reset();
        this.details.clear();
        this.details.push(this.newDetail());
        this.loading = false;
      },
      error: (err: { status: number; error: { message: string } }) => {
        let message = 'Error al crear el inventario.';

        if (err.status === 400)
          message = err.error?.message || 'Datos inválidos.';
        else if (err.status === 403)
          message = 'No tienes permisos para esta acción.';
        else if (err.status === 404)
          message = 'Equipo o ubicación no encontrados.';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });

        this.loading = false;
      },
    });
  }
}
