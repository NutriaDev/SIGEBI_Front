import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Equipment } from '../../models/equipment';
import { EquipmentsService } from '../../services/equipments.service';
import { MaintenanceFreqPipe } from '../../pipes/maintenance-freq.pipe';
import { Router } from '@angular/router';
import { TabService } from 'app/modules/dashboard/services/tab.service';
import { EquipmentCreateComponent } from '../equipment-create/equipment-create.component';
import Swal from 'sweetalert2';
import { EquipmentEditComponent } from '../equipment-edit/equipment-edit.component';
import { MediaService } from 'app/core/services/media.service';

interface SearchTab {
  key: string;
  label: string;
  inputLabel: string;
  placeholder: string;
  endpoint: string;
}

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-equipment-lifecycle',
  standalone: true,
  imports: [CommonModule, FormsModule, MaintenanceFreqPipe],
  templateUrl: './equipment-lifecycle.component.html',
})
export class EquipmentLifecycleComponent {
  // ── Vistas ──────────────────────────────────────────────
  // 'search' → búsqueda  |  'hv' → hoja de vida
  view: 'search' | 'hv' = 'search';

  // ── Equipo seleccionado (HV) ─────────────────────────────
  equipment: Equipment | null = null;

  // ── Búsqueda ─────────────────────────────────────────────
  selectedTab: SearchTab;
  searchValue = '';
  loading = false;
  searched = false;
  errorMessage = '';

  // Sección 1 — búsqueda directa
  quickIdValue = '';
  quickSerieValue = '';

  // ── Resultados ───────────────────────────────────────────
  allResults: Equipment[] = []; // carga del backend, no se modifica
  results: Equipment[] = []; // lista filtrada en memoria

  // ── Filtros combinados ───────────────────────────────────
  activeFilters: ActiveFilter[] = [];
  filterKey = '';
  filterValue = '';

  // ── Images ───────────────────────────────────
  imageUrl: string | null = null;
  uploadingImage = false;

  searchTabs: SearchTab[] = [
    {
      key: 'name',
      label: 'Nombre',
      inputLabel: 'Nombre del equipo',
      placeholder: 'Ej: Monitor',
      endpoint: 'GET /api/equipments/search?name={name}',
    },
    {
      key: 'area',
      label: 'Área',
      inputLabel: 'Nombre del área',
      placeholder: 'Ej: Urgencias',
      endpoint: 'GET /api/equipments/area?name={name}',
    },
    {
      key: 'state',
      label: 'Estado',
      inputLabel: 'Nombre del estado',
      placeholder: 'Ej: Activo',
      endpoint: 'GET /api/equipments/state?name={name}',
    },
    {
      key: 'classification',
      label: 'Clasificación',
      inputLabel: 'Nombre de clasificación',
      placeholder: 'Ej: Diagnóstico',
      endpoint: 'GET /api/equipments/classification?name={name}',
    },
    {
      key: 'provider',
      label: 'Proveedor',
      inputLabel: 'Nombre del proveedor',
      placeholder: 'Ej: Medtronic',
      endpoint: 'GET /api/equipments/provider?name={name}',
    },
    {
      key: 'location',
      label: 'Ubicación',
      inputLabel: 'Nombre de ubicación',
      placeholder: 'Ej: Piso 2',
      endpoint: 'GET /api/equipments/location?name={name}',
    },
  ];

  // Filtros disponibles para refinar (los que no requieren ir al backend)
  filterOptions = [
    { key: 'name', label: 'Nombre' },
    { key: 'areaName', label: 'Área' },
    { key: 'stateName', label: 'Estado' },
    { key: 'classificationName', label: 'Clasificación' },
    { key: 'providerName', label: 'Proveedor' },
    { key: 'locationName', label: 'Ubicación' },
    { key: 'brand', label: 'Marca' },
    { key: 'model', label: 'Modelo' },
  ];

  @Input() equipmentId?: number;

  constructor(
    private equipmentsService: EquipmentsService,
    private tabService: TabService,
    private mediaService: MediaService,
  ) {
    this.selectedTab = this.searchTabs[0];
  }

  ngOnInit(): void {
    if (this.equipmentId) {
      this.equipmentsService.getById(this.equipmentId).subscribe({
        next: (res: any) => this.openHV(res.body),
        error: () => {},
      });
    }
  }

  // ── Tabs ─────────────────────────────────────────────────
  selectTab(tab: SearchTab) {
    this.selectedTab = tab;
    this.searchValue = '';
    this.results = [];
    this.allResults = [];
    this.activeFilters = [];
    this.errorMessage = '';
    this.searched = false;
  }

  searchById() {
    if (!this.quickIdValue.trim()) return;
    this.loading = true;
    this.errorMessage = '';
    this.equipmentsService.getById(+this.quickIdValue).subscribe({
      next: (res: any) => {
        this.openHV(res.body);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Equipo no encontrado',
          text: `No existe un equipo con ID: ${this.quickIdValue}`,
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

  searchBySerie() {
    if (!this.quickSerieValue.trim()) return;
    this.loading = true;
    this.errorMessage = '';
    this.equipmentsService.getBySerie(this.quickSerieValue.trim()).subscribe({
      next: (res: any) => {
        this.openHV(res.body);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Equipo no encontrado',
          text: `No existe un equipo con serie: ${this.quickSerieValue}`,
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

  // ── Búsqueda principal ───────────────────────────────────
  search() {
    if (!this.searchValue.trim()) return;
    this.loading = true;
    this.errorMessage = '';
    this.searched = true;
    this.results = [];
    this.allResults = [];
    this.activeFilters = [];

    const val = this.searchValue.trim();

    const calls: Record<string, any> = {
      id: this.equipmentsService.getById(+val),
      serie: this.equipmentsService.getBySerie(val),
      name: this.equipmentsService.search(val),
      area: this.equipmentsService.getByArea(val),
      state: this.equipmentsService.getByState(val),
      classification: this.equipmentsService.getByClassification(val),
      provider: this.equipmentsService.getByProvider(val),
      location: this.equipmentsService.getByLocation(val),
    };

    calls[this.selectedTab.key].subscribe({
      next: (res: any) => {
        const data = res.body;

        if (data && data.content) {
          const list: Equipment[] = data.content;
          this.allResults = list;
          this.results = [...list];
          this.loading = false;

          if (list.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: `No se encontraron equipos con ese criterio.`,
              confirmButtonText: 'Entendido',
              buttonsStyling: false,
              customClass: {
                popup: 'sigebi-popup',
                confirmButton: 'sigebi-confirm-btn',
              },
            });
          }
          return;
        }

        if (data && !Array.isArray(data)) {
          this.openHV(data as Equipment);
          this.loading = false;
          return;
        }

        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        const is404 = err?.status === 404;
        Swal.fire({
          icon: is404 ? 'info' : 'error',
          title: is404 ? 'Sin resultados' : 'Error en la búsqueda',
          text: is404
            ? 'No se encontró ningún equipo con ese criterio.'
            : 'Ocurrió un error al realizar la búsqueda.',
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

  // ── Filtros combinados en memoria ────────────────────────
  addFilter() {
    if (!this.filterKey || !this.filterValue.trim()) return;

    // Reemplaza si ya existe el mismo filtro
    this.activeFilters = this.activeFilters.filter(
      (f) => f.key !== this.filterKey,
    );

    const label =
      this.filterOptions.find((o) => o.key === this.filterKey)?.label ??
      this.filterKey;
    this.activeFilters.push({
      key: this.filterKey,
      label,
      value: this.filterValue.trim(),
    });

    this.filterKey = '';
    this.filterValue = '';
    this.applyFilters();
  }

  removeFilter(key: string) {
    this.activeFilters = this.activeFilters.filter((f) => f.key !== key);
    this.applyFilters();
  }

  private applyFilters() {
    this.results = this.allResults.filter((eq) => {
      return this.activeFilters.every((f) => {
        const val = String((eq as any)[f.key] ?? '').toLowerCase();
        return val.includes(f.value.toLowerCase());
      });
    });
  }

  // ── Selección y navegación ───────────────────────────────
  selectEquipment(eq: Equipment) {
    this.openHV(eq);
  }

  private openHV(eq: Equipment) {
    this.equipment = eq;
    this.view = 'hv';
    this.loadingImage(eq.equipmentId);
  }

  loadingImage(equipmentId: number): void {
    this.mediaService.getImage(equipmentId).subscribe({
      next: (res: any) => {
        this.imageUrl = res.body?.imageUrl ?? res.imageUrl ?? null;
      },
      error: () => {
        this.imageUrl = null; // no tiene imagen aún
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.equipment) return;

    const file = input.files[0];
    this.uploadingImage = true;

    this.mediaService.uploadImage(this.equipment.equipmentId, file).subscribe({
      next: (res: any) => {
        this.imageUrl = res.body?.imageUrl ?? res.imageUrl;
        this.uploadingImage = false;
        Swal.fire({
          icon: 'success',
          title: 'Imagen subida correctamente',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });
      },
      error: () => {
        this.uploadingImage = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al subir imagen',
          text: 'No se pudo subir la imagen del equipo.',
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

  deleteImage(): void {
    if (!this.equipment) return;

    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar imagen?',
      text: 'Se eliminará la imagen del equipo.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        popup: 'sigebi-popup',
        confirmButton: 'sigebi-confirm-btn',
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.mediaService.deleteImage(this.equipment!.equipmentId).subscribe({
        next: () => {
          this.imageUrl = null;
          Swal.fire({
            icon: 'success',
            title: 'Imagen eliminada',
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });
        },
        error: () => {},
      });
    });
  }

  createEquipment() {
    this.tabService.openTab('Crear Equipos', EquipmentCreateComponent);
  }

  edit(eq: Equipment): void {
    this.tabService.openTab('Editar Equipo', EquipmentEditComponent, {
      equipmentId: eq.equipmentId,
    });
  }

  goBack() {
    this.equipment = null;
    this.view = 'search';
    this.quickIdValue = '';
    this.quickSerieValue = '';
    this.results = [];
    this.allResults = [];
    this.activeFilters = [];
    this.searched = false;
    this.searchValue = '';
  }
}
