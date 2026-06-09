import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-consolidated-report',
  templateUrl: './consolidated-report.component.html',
})
export class ConsolidatedReportComponent implements OnInit {
  filterForm!: FormGroup;

  records: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  loading = false;
  errorMsg = '';
  searched = false;

  readonly maintenanceTypes = [
    { value: '', label: 'Todos' },
    { value: 'PREVENTIVO', label: 'PREVENTIVO' },
    { value: 'CORRECTIVO', label: 'CORRECTIVO' },
    { value: 'CALIBRACION', label: 'CALIBRACION' },
  ];

  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService,
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      equipmentId: [null],
      physicalLocation: [''],
      maintenanceType: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.filterForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSearch(page: number = 0): void {
    this.loading = true;
    this.errorMsg = '';
    this.currentPage = page;

    const { equipmentId, physicalLocation, maintenanceType, fromDate, toDate } = this.filterForm.value;

    this.reportsService.getConsolidatedWithFilters({
      equipmentId: equipmentId || undefined,
      physicalLocation: physicalLocation || undefined,
      maintenanceType: maintenanceType || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      page,
      size: this.pageSize,
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.searched = true;
        this.records = res.body?.content ?? [];
        this.totalElements = res.body?.totalElements ?? 0;
        this.totalPages = res.body?.totalPages ?? 0;
      },
      error: (err) => {
        this.loading = false;
        this.searched = true;
        this.errorMsg = err?.error?.message || 'Error al consultar el reporte consolidado.';
      },
    });
  }

  onClear(): void {
    this.filterForm.reset({
      equipmentId: null,
      physicalLocation: '',
      maintenanceType: '',
      fromDate: '',
      toDate: '',
    });
    this.records = [];
    this.totalElements = 0;
    this.totalPages = 0;
    this.currentPage = 0;
    this.searched = false;
    this.errorMsg = '';
  }

  prevPage(): void {
    if (this.currentPage > 0) this.onSearch(this.currentPage - 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) this.onSearch(this.currentPage + 1);
  }

  get startRecord(): number {
    return this.totalElements === 0 ? 0 : this.currentPage * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }
}
