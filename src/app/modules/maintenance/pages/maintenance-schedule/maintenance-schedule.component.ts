import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaintenanceService } from '../../services/maintenance.service';

@Component({
  selector: 'app-maintenance-schedule',
  templateUrl: './maintenance-schedule.component.html',
})
export class MaintenanceScheduleComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';

  readonly maintenanceTypes = [
    { value: 1, label: 'PREVENTIVO' },
    { value: 2, label: 'CORRECTIVO' },
    { value: 3, label: 'CALIBRACION' },
  ];

  constructor(
    private fb: FormBuilder,
    private maintenanceService: MaintenanceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      equipmentId: [null, [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      notes: [''],
    });
  }

  get f() {
    return this.form.controls;
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    const value = this.form.value;
    const payload = {
      equipmentId: value.equipmentId,
      maintenanceType: value.type,
      scheduledDate: value.scheduledDate
        ? new Date(value.scheduledDate).toISOString()
        : '',
      notes: value.notes || undefined,
    };

    this.maintenanceService.scheduleMaintenance(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = res.message;
        this.form.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err?.error?.message || 'Error al programar el mantenimiento.';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/mantenimiento/cronograma']);
  }
}
