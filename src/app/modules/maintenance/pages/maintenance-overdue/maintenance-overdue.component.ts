import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../services/maintenance.service';
import { MaintenanceScheduleResponse } from '../../models/model';

@Component({
  selector: 'app-maintenance-overdue',
  templateUrl: './maintenance-overdue.component.html',
})
export class MaintenanceOverdueComponent implements OnInit {
  records: MaintenanceScheduleResponse[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  loading = true;
  errorMsg = '';

  constructor(private maintenanceService: MaintenanceService) {}

  ngOnInit(): void {
    this.load(0);
  }

  load(page: number): void {
    this.loading = true;
    this.errorMsg = '';
    this.currentPage = page;

    this.maintenanceService.getOverdueSchedules(page, this.pageSize).subscribe({
      next: (res) => {
        this.loading = false;
        this.records = res.body.content;
        this.totalElements = res.body.totalElements;
        this.totalPages = res.body.totalPages;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err?.error?.message || 'Error al cargar los mantenimientos vencidos.';
      },
    });
  }

  prevPage(): void {
    if (this.currentPage > 0) this.load(this.currentPage - 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) this.load(this.currentPage + 1);
  }

  get startRecord(): number {
    return this.totalElements === 0 ? 0 : this.currentPage * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }
}
