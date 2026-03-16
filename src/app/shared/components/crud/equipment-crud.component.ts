import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipment-crud',
  templateUrl: './equipment-crud.component.html',
})
export class EquipmentCrudComponent implements OnInit {
  @Input() service: any;
  @Input() title: string = '';

  items: any[] = [];
  newName = '';
  selected: any = null;
  searchText = '';
  searchId: number | null = null;

  viewMode: 'list' | 'create' | 'update' = 'list';

  constructor() {}

  ngOnInit() {
    this.load();
  }

  private getId(): number {
    return (
      this.selected?.id ??
      this.selected?.areaId ??
      this.selected?.classificationId ??
      this.selected?.stateId
    );
  }

  load() {
    this.service.getAll().subscribe((res: any) => {
      this.items = res.body.content ?? res.body;
    });
  }

  searchByName() {
    if (!this.searchText.trim()) return;
    this.service.getByName(this.searchText.trim()).subscribe({
      next: (res: any) => {
        this.items = res.body.content ?? [res.body];
        this.viewMode = 'list';
      },
      error: () => {
        Swal.fire({
          icon: 'warning',
          title: 'No encontrado',
          text: `No se encontró ningún resultado con el nombre "${this.searchText}"`,
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

  searchById() {
    if (!this.searchId) return;
    this.service.getById(this.searchId).subscribe((res: any) => {
      this.items = [res.body];
      this.viewMode = 'list';
    });
  }

  create() {
    if (!this.newName.trim()) return;
    this.service.create({ name: this.newName }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: `${this.title} creado correctamente`,
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });
        this.newName = '';
        this.viewMode = 'list';
        this.load();
      },
      error: (err: any) => {
        const isDuplicate = err?.status === 409;
        Swal.fire({
          icon: 'error',
          title: isDuplicate ? 'Nombre duplicado' : 'Error al crear',
          text: err?.error?.message ?? `No se pudo crear ${this.title}`,
          confirmButtonText: 'Entendido',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });
      },
    });
  }

  select(item: any) {
    console.log('item seleccionado:', item);
    this.selected = { ...item };
    this.viewMode = 'update';
  }

  goToUpdate() {
    if (!this.selected) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona un elemento',
        text: 'Debes buscar y seleccionar un elemento para editarlo.',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false,
        customClass: {
          popup: 'sigebi-popup',
          confirmButton: 'sigebi-confirm-btn',
        },
      });
      return;
    }
    this.viewMode = 'update';
  }

  update() {
    const id = this.getId();
    this.service.update(id, { name: this.selected.name }).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Actualizado correctamente',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false,
        customClass: {
          popup: 'sigebi-popup',
          confirmButton: 'sigebi-confirm-btn',
        },
      });
      this.viewMode = 'list';
      this.load();
    });
  }

  deactivate() {
    const id = this.getId();
    console.log('deactivate id:', id);
    this.service.deactivate(id).subscribe(() => {
      this.selected.active = !this.selected.active; // toggle local
      this.viewMode = 'list';
      this.load();
    });
  }
}
