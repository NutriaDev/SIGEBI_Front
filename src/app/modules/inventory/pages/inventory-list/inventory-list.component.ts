import { Component, OnInit } from '@angular/core';
import { InventoryResponse, InventoryFilters } from '../../models/model';
import { InventoryService } from '../../services/inventory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
})
export class InventoryListComponent implements OnInit {
  inventories: InventoryResponse[] = [];
  loading = false;

  // Paginación
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  readonly pageSize = 10;

  // Filtros
  filters: InventoryFilters = {};
  filterDate = '';
  filterLocationId: number | '' = '';

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.load();
  }

  load(page = 0): void {
    this.loading = true;
    this.currentPage = page;

    const params: InventoryFilters = {
      page,
      limit: this.pageSize,
      ...(this.filterDate ? { date: this.filterDate } : {}),
      ...(this.filterLocationId
        ? { locationId: Number(this.filterLocationId) }
        : {}),
    };

    this.inventoryService.getInventories(params).subscribe({
      next: (res) => {
        this.inventories = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los inventarios.',
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

  applyFilters(): void {
    this.load(0);
  }

  clearFilters(): void {
    this.filterDate = '';
    this.filterLocationId = '';
    this.load(0);
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.load(page);
  }

  hasMissing(observations: string | null | undefined): boolean {
  if (!observations) return false;

    return (
      observations.includes('Faltantes físicamente') &&
      !observations.includes('Faltantes físicamente: []')
    );
  }

  hasSurplus(observations: string | null | undefined): boolean {
    if (!observations) return false;

    return (
      observations.includes('Sobrantes físicamente') &&
      !observations.includes('Sobrantes físicamente: []')
    );
  }

  get missingCount(): number {
    return this.inventories.filter(item =>
      this.hasMissing(item.observations)
    ).length;
  }

  get surplusCount(): number {
    return this.inventories.filter(item =>
      this.hasSurplus(item.observations)
    ).length;
  }

}
