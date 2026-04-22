import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { CreateMovementPayload } from '../../models/model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movement-create',
  templateUrl: './movement-create.component.html',
})
export class MovementCreateComponent {
  @Output() created = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  movementForm: FormGroup;
  loading = false;

  readonly reasons = [
    { value: 'TRANSFER', label: 'Traslado' },
    { value: 'MAINTENANCE', label: 'Mantenimiento' },
    { value: 'LOAN', label: 'Préstamo' },
    { value: 'RETURN', label: 'Devolución' },
  ];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
  ) {
    this.movementForm = this.fb.group({
      serial: ['', Validators.required],
      originLocationId: ['', [Validators.required, Validators.min(1)]],
      destinationLocationId: ['', [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.movementForm.invalid) {
      this.movementForm.markAllAsTouched();
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

    const payload = {
      serial: this.movementForm.value.serial?.trim(), // 🔥 ESTE ES EL FIX
      originLocationId: Number(this.movementForm.value.originLocationId),
      destinationLocationId: Number(
        this.movementForm.value.destinationLocationId,
      ),
      reason: this.movementForm.value.reason,
    };

    console.log('PAYLOAD REAL:', payload); // 🔥 DEBUG

    this.loading = true;

    this.inventoryService.createMovement(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Movimiento registrado',
          text: 'El movimiento fue registrado correctamente.',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });

        this.loading = false;
        this.created.emit();
      },
      error: (err) => {
        console.error('ERROR BACK:', err);

        let message = 'Error al registrar el movimiento.';

        if (err.status === 404) message = 'Equipo o ubicación no encontrados.';
        else if (err.status === 400)
          message = err.error?.message || 'Datos inválidos.';
        else if (err.status === 403)
          message = 'No tienes permisos para esta acción.';

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

  onSerialChange(): void {
    const raw = this.movementForm.value.serial;

    const serial = (raw || '').trim().replace(/\s+/g, '');

    console.log('SERIAL LIMPIO:', JSON.stringify(serial));

    if (!serial) return;

    this.inventoryService.getEquipmentBySerial(serial).subscribe({
      next: (res: any) => {
        const equipment = res.body ?? res;

        this.movementForm.patchValue({
          originLocationId: equipment.locationId,
        });
        Swal.fire({
          icon: 'info',
          title: 'Equipo encontrado',
          text: `Ubicación origen: ${equipment.locationId}`,
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        console.error('ERROR REAL:', err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.error || 'Equipo no encontrado',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });
      },
    });
  }
}
