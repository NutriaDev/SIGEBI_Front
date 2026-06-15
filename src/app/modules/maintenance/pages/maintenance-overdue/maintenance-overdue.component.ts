import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../services/maintenance.service';
import { MaintenanceScheduleResponse } from '../../models/model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maintenance-overdue',
  templateUrl: './maintenance-overdue.component.html',
})
export class MaintenanceOverdueComponent implements OnInit {
  records: MaintenanceScheduleResponse[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  loading = true;
  hasError = false;

  constructor(private maintenanceService: MaintenanceService) {}

  ngOnInit(): void {
    this.load(0);
  }

  load(page: number): void {
    this.loading = true;
    this.hasError = false;
    this.currentPage = page;

    this.maintenanceService.getOverdueSchedules(page, this.pageSize).subscribe({
      next: (res) => {
        this.loading = false;
        this.records = res.body.content;
        this.totalElements = res.body.totalElements;
        this.totalPages = res.body.totalPages;
      },
      error: (err) => {
        this.loading = false;
        this.hasError = true;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Error al cargar los mantenimientos vencidos.',
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

  prevPage(): void {
    if (this.currentPage > 0) this.load(this.currentPage - 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) this.load(this.currentPage + 1);
  }

  onEdit(row: MaintenanceScheduleResponse): void {

  Swal.fire({
    title: 'Gestionar mantenimiento vencido',
    text: `Programación #${row.idSchedule}`,
    input: 'number',
    inputLabel: 'ID del mantenimiento realizado',
    inputPlaceholder: 'Ej: 25',
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    buttonsStyling: false,
    customClass: {
      popup: 'sigebi-popup',
      confirmButton: 'sigebi-confirm-btn',
      cancelButton: 'sigebi-cancel-btn',
    },
    inputValidator: (value) => {
      if (!value) {
        return 'Debes ingresar el ID del mantenimiento';
      }
      return null;
    },
  }).then((result) => {

    if (!result.isConfirmed) {
      return;
    }

    const payload = {
      scheduleId: row.idSchedule,
      maintenanceId: Number(result.value),
    };

    this.maintenanceService
      .finalizeSchedule(payload)
      .subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Programación actualizada',
            text: 'El mantenimiento fue asociado correctamente.',
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });

          this.load(this.currentPage);
        },

        error: (err) => {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              err?.error?.message ||
              'No fue posible actualizar la programación.',
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });

        },
      });

  });
}

  get startRecord(): number {
    return this.totalElements === 0 ? 0 : this.currentPage * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }
}
