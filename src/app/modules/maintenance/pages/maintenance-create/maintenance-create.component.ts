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
    { value: 'MP', label: 'MP – Mantenimiento Preventivo' },
    { value: 'MCP', label: 'MCP – Mantenimiento Correctivo Programado' },
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

    // Convert HTML datetime-local to ISO string expected by backend
    const payload = {
      ...value,
      date: value.date ? new Date(value.date).toISOString() : null,
      nextMaintenanceDate: value.nextMaintenanceDate
        ? new Date(value.nextMaintenanceDate).toISOString()
        : null,
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
