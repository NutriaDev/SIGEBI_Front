import { Component, OnInit } from '@angular/core';
import { AreaService } from '../../services/area.service';
import { Area } from '../../models/area';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
})
export class AreaFormComponent implements OnInit {
  viewMode: 'list' | 'create' | 'update' | null = null;

  areas: any[] = [];
  selectedArea: any = null;
  searchText = '';
  searchId!: number;
  newAreaName = '';
  loading = false;

  constructor(private areaService: AreaService) {}

  ngOnInit(): void {
    this.loadAreas();
  }

  loadAreas() {
    this.areaService.getAllAreas().subscribe((res) => {
      this.areas = res;
    });
  }

  showAreas() {
    this.viewMode = 'list';
    this.loadAreas();
  }

  showCreate() {
    this.viewMode = 'create';
  }

  showUpdate() {
    this.viewMode = 'update';
  }

  selectArea(area: any) {
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

  searchAreaByName() {
    if (!this.searchText) return;

    this.areaService.getAreaByName(this.searchText).subscribe({
      next: (res) => {
        console.log('RESPESTA BACK', res);
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
      .updateArea(this.selectedArea.areaId, this.searchText)
      .subscribe(() => {
        this.loadAreas();
        this.selectedArea = null;
        this.searchText = '';
      });
  }

  deactivateArea() {
    console.log('Desactivar area', this.selectedArea);
  }
}
