import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Equipment } from '../../models/equipment';
import { EquipmentsService } from '../../services/equipments.service';
import { MaintenanceFreqPipe } from '../../pipes/maintenance-freq.pipe';

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
      inputLabel: 'ID del área',
      placeholder: 'Ej: 2',
      endpoint: 'GET /api/equipments/area/{id}',
    },
    {
      key: 'state',
      label: 'Estado',
      inputLabel: 'ID del estado',
      placeholder: 'Ej: 1',
      endpoint: 'GET /api/equipments/state/{id}',
    },
    {
      key: 'classification',
      label: 'Clasificación',
      inputLabel: 'ID clasificación',
      placeholder: 'Ej: 2',
      endpoint: 'GET /api/equipments/classification/{id}',
    },
    {
      key: 'provider',
      label: 'Proveedor',
      inputLabel: 'ID del proveedor',
      placeholder: 'Ej: 1',
      endpoint: 'GET /api/equipments/provider/{id}',
    },
    {
      key: 'location',
      label: 'Ubicación',
      inputLabel: 'ID de ubicación',
      placeholder: 'Ej: 3',
      endpoint: 'GET /api/equipments/location/{id}',
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

  constructor(private equipmentsService: EquipmentsService) {
    this.selectedTab = this.searchTabs[0];
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
        console.log('RES COMPLETO:', res); // 👈 agrega esto
        this.openHV(res.body);
        this.loading = false;
      },
      error: (err) => {
        console.log('ERROR:', err); // 👈 y esto
        this.errorMessage = 'No se encontró el equipo.';
        this.loading = false;
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
        this.errorMessage = 'No se encontró el equipo.';
        this.loading = false;
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
      area: this.equipmentsService.getByArea(+val),
      state: this.equipmentsService.getByState(+val),
      classification: this.equipmentsService.getByClassification(+val),
      provider: this.equipmentsService.getByProvider(+val),
      location: this.equipmentsService.getByLocation(+val),
    };

    calls[this.selectedTab.key].subscribe({
      next: (res: any) => {
        const data = res.body;

        // Para búsqueda avanzada siempre viene paginado
        // Spring Page: { content: [], totalElements, ... }
        if (data && data.content) {
          const list: Equipment[] = data.content;
          this.allResults = list;
          this.results = [...list];
          this.loading = false;
          return;
        }

        // Resultado único (por si acaso)
        if (data && !Array.isArray(data)) {
          this.openHV(data as Equipment);
          this.loading = false;
          return;
        }

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se encontró ningún equipo con ese criterio.';
        this.loading = false;
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
