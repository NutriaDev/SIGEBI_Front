import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceService } from '../../services/maintenance.service';
import { MaintenanceResponse } from '../../models/model';

@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
})
export class MaintenanceListComponent implements OnInit {
  filterForm!: FormGroup;

  records: MaintenanceResponse[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  loading = false;
  errorMsg = '';
  searched = false;

  readonly maintenanceTypes = [
    { value: '', label: 'Todos' },
    { value: 1, label: 'PREVENTIVO' },
    { value: 2, label: 'CORRECTIVO' },
    { value: 3, label: 'CALIBRACION' },
  ];

  constructor(
    private fb: FormBuilder,
    private maintenanceService: MaintenanceService,
  ) {}

  ngOnInit(): void {
    // Default date range: last 30 days
    const today = new Date();
    const from30 = new Date();
    from30.setDate(today.getDate() - 30);

    this.filterForm = this.fb.group({
      equipmentId: [null, [Validators.required, Validators.min(1)]],
      type: [''],
      fromDate: [this.toLocalInput(from30), Validators.required],
      toDate: [this.toLocalInput(today), Validators.required],
    });
  }

  /** Converts a Date to the string format required by datetime-local input */
  private toLocalInput(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  isInvalid(field: string): boolean {
    const ctrl = this.filterForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSearch(page: number = 0): void {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.currentPage = page;

    const { equipmentId, type, fromDate, toDate } = this.filterForm.value;

    this.maintenanceService
      .getMaintenanceHistory(
        equipmentId,
        new Date(fromDate).toISOString(),
        new Date(toDate).toISOString(),
        type || undefined,
        page,
        this.pageSize,
      )
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.searched = true;
          this.records = res.body.content;
          this.totalElements = res.body.totalElements;
          this.totalPages = res.body.totalPages;
        },
        error: (err) => {
          this.loading = false;
          this.searched = true;
          this.errorMsg =
            err?.error?.message || 'Error al consultar el historial.';
        },
      });
  }

  onClear(): void {
    this.filterForm.reset({
      equipmentId: null,
      type: '',
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
    if (this.currentPage < this.totalPages - 1)
      this.onSearch(this.currentPage + 1);
  }

  get startRecord(): number {
    return this.totalElements === 0 ? 0 : this.currentPage * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }
}
