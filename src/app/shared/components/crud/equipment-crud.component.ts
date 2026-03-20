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

  // ── Paginación ──────────────────────────────────────────
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

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
    const pageable = {
      page: this.currentPage,
      size: this.pageSize,
      sort: 'active,desc',
    }; // 👈 activos primero
    this.service.getAll(pageable).subscribe((res: any) => {
      const data = res.body;
      this.items = data.content ?? data;
      this.totalElements = data.totalElements ?? this.items.length;
      this.totalPages = data.totalPages ?? 1;
    });
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.load();
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
        const isNoPermission = err?.status === 403 || err?.status === 500; // 👈
        Swal.fire({
          icon: 'error',
          title: isNoPermission
            ? 'Sin permisos'
            : isDuplicate
              ? 'Nombre duplicado'
              : 'Error al crear',
          text: isNoPermission
            ? 'No tienes permisos para crear este recurso.'
            : (err?.error?.message ?? `No se pudo crear ${this.title}`),
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
    this.service.update(id, { name: this.selected.name }).subscribe({
      next: () => {
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
      },
      error: (err: any) => {
        const isNoPermission = err?.status === 403 || err?.status === 500;
        Swal.fire({
          icon: 'error',
          title: isNoPermission ? 'Sin permisos' : 'Error al actualizar',
          text: isNoPermission
            ? 'No tienes permisos para actualizar este recurso.'
            : (err?.error?.message ?? `No se pudo actualizar ${this.title}`),
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

  deactivate() {
    const id = this.getId();
    this.service.deactivate(id).subscribe({
      next: () => {
        this.selected.active = !this.selected.active;
        this.viewMode = 'list';
        this.load();
      },
      error: (err: any) => {
        const isNoPermission = err?.status === 403 || err?.status === 500;
        Swal.fire({
          icon: 'error',
          title: isNoPermission ? 'Sin permisos' : 'Error al cambiar estado',
          text: isNoPermission
            ? 'No tienes permisos para cambiar el estado de este recurso.'
            : (err?.error?.message ??
              `No se pudo cambiar el estado de ${this.title}`),
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
}
