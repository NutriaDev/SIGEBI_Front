import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../services/audit.service';
import { AuditLogResponse } from '../../models/audit.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
})
export class AuditLogsComponent implements OnInit {
  records: AuditLogResponse[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  filterUserId?: number;
  filterModule = '';
  filterAction = '';
  filterFromDate = '';
  filterToDate = '';

  loading = true;
  hasError = false;

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.search(0);
  }

  search(page: number): void {
    this.loading = true;
    this.hasError = false;
    this.currentPage = page;

    const filters = {
      userId: this.filterUserId || undefined,
      module: this.filterModule || undefined,
      action: this.filterAction || undefined,
      fromDate: this.filterFromDate || undefined,
      toDate: this.filterToDate || undefined,
      page,
      size: this.pageSize,
    };

    this.auditService.getAuditLogs(filters).subscribe({
      next: (res) => {
        this.loading = false;
        this.records = res.body.content;
        this.totalElements = res.body.totalElements;
        this.totalPages = res.body.totalPages;
      },
      error: (err) => {
        this.loading = false;
        this.hasError = true;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            err?.error?.message ||
            'Error al cargar los registros de auditoría.',
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

  clearFilters(): void {
    this.filterUserId = undefined;
    this.filterModule = '';
    this.filterAction = '';
    this.filterFromDate = '';
    this.filterToDate = '';
    this.search(0);
  }

  prevPage(): void {
    if (this.currentPage > 0) this.search(this.currentPage - 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) this.search(this.currentPage + 1);
  }

  getActionBadge(action: string): string {
    const badges: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      DOWNLOAD: 'bg-purple-100 text-purple-800',
      FINALIZE: 'bg-orange-100 text-orange-800',
    };
    return badges[action] || 'bg-gray-100 text-gray-800';
  }

  get startRecord(): number {
    return this.totalElements === 0 ? 0 : this.currentPage * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }
}
