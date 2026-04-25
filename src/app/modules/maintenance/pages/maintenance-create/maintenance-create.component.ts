import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaintenanceService } from '../../services/maintenance.service';

@Component({
  selector: 'app-maintenance-create',
  templateUrl: './maintenance-create.component.html',
})
export class MaintenanceCreateComponent implements OnInit {
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
      date: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      technicianId: [null, [Validators.required, Validators.min(1)]],
      nextMaintenanceDate: [''],
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

    const formatLocalDateTime = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      date.setSeconds(0);
      date.setMilliseconds(0);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const payload = {
      equipmentId: value.equipmentId,
      maintenanceType: value.type,
      date: formatLocalDateTime(value.date),
      description: value.description,
      technicianId: value.technicianId,
      nextMaintenanceDate: value.nextMaintenanceDate
        ? formatLocalDateTime(value.nextMaintenanceDate)
        : undefined,
    };

    this.maintenanceService.registerMaintenance(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = res.message;
        this.form.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err?.error?.message || 'Error al registrar el mantenimiento.';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/mantenimiento/lista']);
  }
}
