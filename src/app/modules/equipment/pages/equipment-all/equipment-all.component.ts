import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Equipment } from '../../models/equipment';
import { EquipmentsService } from '../../services/equipments.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipment-all',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipment-all.component.html',
})
export class EquipmentAllComponent implements OnInit {
  equipments: Equipment[] = [];
  loading = false;

  // ── Paginación ──────────────────────────────────────────
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  constructor(private equipmentsService: EquipmentsService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const pageable = {
      page: this.currentPage,
      size: this.pageSize,
      sort: 'active,desc',
    };

    this.equipmentsService.getAll(pageable).subscribe({
      next: (res: any) => {
        console.log('RES COMPLETO:', res); // 👈
        console.log('BODY:', res.body); // 👈
        const data = res.body;
        this.equipments = data.content ?? data;
        this.totalElements = data.totalElements ?? this.equipments.length;
        this.totalPages = data.totalPages ?? 1;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar equipos',
          text: 'No se pudo obtener la lista de equipos.',
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

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.load();
  }
}
