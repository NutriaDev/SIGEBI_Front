import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-equipment-location',
  templateUrl: './equipment-location.component.html',
})
export class EquipmentLocationComponent implements OnInit {
  filterForm!: FormGroup;

  snapshot: any = null;
  loading = false;
  errorMsg = '';
  searched = false;

  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService,
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      equipmentId: [null, [Validators.required, Validators.min(1)]],
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.filterForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  search(): void {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.searched = false;
    this.snapshot = null;

    const { equipmentId } = this.filterForm.value;

    this.reportsService.getEquipmentSnapshot(equipmentId).subscribe({
      next: (res) => {
        this.loading = false;
        this.searched = true;
        this.snapshot = res.body;
      },
      error: (err) => {
        this.loading = false;
        this.searched = true;
        this.errorMsg =
          err?.error?.message || 'No se encontró información del equipo.';
      },
    });
  }

  clear(): void {
    this.filterForm.reset({ equipmentId: null });
    this.snapshot = null;
    this.searched = false;
    this.errorMsg = '';
  }
}
