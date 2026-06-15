import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaintenanceService } from '../../services/maintenance.service';
import { TabService } from '../../../dashboard/services/tab.service';
import { ServiceReportCreateComponent } from '../../../reports/pages/service-report-create/service-report-create.component';

@Component({
  selector: 'app-maintenance-create',
  templateUrl: './maintenance-create.component.html',
})
export class MaintenanceCreateComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';
  currentUserName: string = '';

  readonly maintenanceTypes = [
    { value: 1, label: 'PREVENTIVO' },
    { value: 2, label: 'CORRECTIVO' },
    { value: 3, label: 'CALIBRACION' },
  ];

  constructor(
    private fb: FormBuilder,
    private maintenanceService: MaintenanceService,
    private router: Router,
    private tabService: TabService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      equipmentId: [null, [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
      date: ['', Validators.required],
      issueDescription: ['', [Validators.required, Validators.minLength(20)]],
      nextMaintenanceDate: [''],
    });

    const user = this.getUserFromToken();

    this.currentUserName = user?.name || user?.sub || 'Usuario autenticado';
  }

  get f() {
    return this.form.controls;
  }

  getUserFromToken(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
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
      issueDescription: value.issueDescription,
    };

    this.maintenanceService.registerMaintenance(payload).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Respuesta completa del API:', res); // ← agregar
        console.log('res.body:', res.body); // ← agregar
        console.log('res.body?.id:', res.body?.idMaintenance); // ← agregar

        this.tabService.openTab(
          'Reporte de Servicio',
          ServiceReportCreateComponent,
          { maintenanceId: res.body?.idMaintenance },
        );
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
