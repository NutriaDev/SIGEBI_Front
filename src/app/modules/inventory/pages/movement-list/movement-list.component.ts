import { Component, OnInit } from '@angular/core';
import { MovementResponse, MovementFilters } from '../../models/model';
import { InventoryService } from '../../services/inventory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movements-list',
  templateUrl: './movement-list.component.html',
})
export class MovementsListComponent implements OnInit {
  movements: MovementResponse[] = [];
  loading = false;

  // Paginación
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  readonly pageSize = 10;

  // Filtros
  filterEquipmentId: number | '' = '';
  filterLocationId: number | '' = '';
  filterDate = '';

  // Control modal registrar movimiento
  showCreateModal = false;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.load();
  }

  load(page = 0): void {
    this.loading = true;
    this.currentPage = page;

    const params: MovementFilters = {
      page,
      limit: this.pageSize,
      ...(this.filterEquipmentId
        ? { equipmentId: Number(this.filterEquipmentId) }
        : {}),
      ...(this.filterLocationId
        ? { locationId: Number(this.filterLocationId) }
        : {}),
      ...(this.filterDate ? { date: this.filterDate } : {}),
    };

    this.inventoryService.getMovements(params).subscribe({
      next: (res) => {
        this.movements = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los movimientos.',
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
    this.filterEquipmentId = '';
    this.filterLocationId = '';
    this.filterDate = '';
    this.load(0);
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.load(page);
  }

  onMovementCreated(): void {
    this.showCreateModal = false;
    this.load(0);
  }

  reasonLabel(reason: string): string {
    const map: Record<string, string> = {
      TRANSFER: 'Traslado',
      MAINTENANCE: 'Mantenimiento',
      LOAN: 'Préstamo',
      RETURN: 'Devolución',
    };
    return map[reason] ?? reason;
  }
}
