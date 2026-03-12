import { Component, OnInit } from '@angular/core';
import { AreaService } from '../../services/area.service';
import { ApiResponse } from '../../models/response';
import Swal from 'sweetalert2';
import { Area } from '../../models/area';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
})
export class AreaFormComponent implements OnInit {
  viewMode: 'list' | 'create' | 'update' | null = 'list';

  areas: Area[] = [];
  selectedArea: Area | null = null;
  searchText = '';
  searchId!: number;
  newAreaName = '';
  loading = false;

  constructor(private areaService: AreaService) {}

  ngOnInit(): void {
    this.showAreas();
  }
  loadAreas() {
    this.areaService.getAllAreas().subscribe((res: any) => {
      this.areas = res.body.content;
    });
  }

  showAreas() {
    this.viewMode = 'list';
    this.loadAreas();
  }

  showCreate() {
    this.viewMode = 'create';
  }

  selectArea(area: Area) {
    console.log('AREA SELECCIONADA:', area);
    this.selectedArea = area;
    this.viewMode = 'update';
  }

  createArea() {
    if (!this.newAreaName) {
      Swal.fire({
        icon: 'warning',
        title: 'Nombre requerido',
        text: 'Debes ingresar un nombre para el área.',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false,
        customClass: {
          popup: 'sigebi-popup',
          confirmButton: 'sigebi-confirm-btn',
        },
      });
      return;
    }

    const request = {
      name: this.newAreaName,
    };

    this.loading = true;

    this.areaService.createArea(request).subscribe({
      next: (res) => {
        this.loading = false;

        this.newAreaName = '';

        Swal.fire({
          icon: 'success',
          title: 'Área creada correctamente',
          text: 'El área fue registrada en el sistema.',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });
      },
      error: (err) => {
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Error al crear el área',
          text: 'Ocurrió un problema al registrar el área.',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });

        console.error(err);
      },
    });
  }

  showUpdate() {
    if (!this.selectedArea) {
      Swal.fire({
        icon: 'info',
        title: 'Selecciona un área',
        text: 'Primero selecciona un área del listado.',
      });
      return;
    }

    this.viewMode = 'update';
  }

  searchAreaByName() {
    if (!this.searchText) return;

    this.areaService.getAreaByName(this.searchText).subscribe({
      next: (res) => {
        const area = res.body;

        Swal.fire({
          icon: area.active ? 'success' : 'warning',
          title: area.name,
          text: area.active ? 'Área activada' : 'Área desactivada',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Área no encontrada',
          text: 'No existe un área con ese nombre',
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

  searchAreaById() {
    if (!this.searchId) return;

    this.areaService.getAreaById(this.searchId).subscribe({
      next: (res: any) => {
        const area = res?.body;

        if (!area) {
          Swal.fire({
            icon: 'error',
            title: 'Área no encontrada',
            text: 'No existe información para ese ID',
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });
          return;
        }

        Swal.fire({
          icon: area.active ? 'success' : 'warning',
          title: area.name,
          text: area.active ? 'Área activada' : 'Área desactivada',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Área no encontrada',
          text: 'No existe un área con ese ID',
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

  updateArea() {
    if (!this.selectedArea) return;

    this.areaService
      .updateArea(
        this.selectedArea.areaId,
        this.selectedArea.name,
        this.selectedArea.active,
      )
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Área actualizada',
            text: 'La información del área fue actualizada.',
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });

          this.loadAreas();
        },
        error: (err) => {
          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: 'No fue posible actualizar el área.',
            confirmButtonText: 'Aceptar',
          });
        },
      });
  }

  toggleAreaStatus() {
    if (!this.selectedArea) return;

    const newStatus = !this.selectedArea!.active;

    this.areaService
      .updateArea(this.selectedArea.areaId, this.selectedArea.name, newStatus)
      .subscribe(() => {
        this.selectedArea!.active = newStatus;

        Swal.fire({
          icon: 'success',
          title: newStatus ? 'Área activada' : 'Área desactivada',
          confirmButtonText: 'Aceptar',
        });

        this.loadAreas();
      });
  }
}
