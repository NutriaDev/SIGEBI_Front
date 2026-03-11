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
