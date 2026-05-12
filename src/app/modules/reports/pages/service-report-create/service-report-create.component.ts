import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportsService } from '../../services/reports.service';
import { ServiceReportRequest } from '../../models/service-report-request.model';
import { SparePartItem } from '../../models/spare-part-item.model';
import { TabService } from 'app/modules/dashboard/services/tab.service';

@Component({
  selector: 'app-service-report-create',
  templateUrl: './service-report-create.component.html',
})
export class ServiceReportCreateComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';
  @Input() maintenanceId!: number;
  hasSpares = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reportsService: ReportsService,
    private tabService: TabService,
  ) {}

  ngOnInit(): void {
    // Leer maintenanceId desde el data del tab activo
    this.tabService.tabs$.subscribe((tabs) => {
      const tab = tabs.find((t) => t.title === 'Reporte de Servicio');
      if (tab?.data?.maintenanceId) {
        this.maintenanceId = Number(tab.data.maintenanceId);
      }
    });

    this.form = this.fb.group({
      diagnosis: ['', [Validators.required, Validators.maxLength(1000)]],
      activitiesPerformed: [
        '',
        [Validators.required, Validators.maxLength(2000)],
      ],
      observations: ['', Validators.maxLength(1000)],
      sparePartsUsed: this.fb.array([]),
    });
  }

  get sparePartsArray(): FormArray {
    return this.form.get('sparePartsUsed') as FormArray;
  }

  newSpareRow(): FormGroup {
    return this.fb.group({
      quantity: [null],
      reference: [''],
      description: [''],
    });
  }

  toggleSpares(value: boolean): void {
    this.hasSpares = value;
    this.sparePartsArray.clear();
    if (value) this.sparePartsArray.push(this.newSpareRow());
  }

  addRow(): void {
    this.sparePartsArray.push(this.newSpareRow());
  }

  removeRow(i: number): void {
    this.sparePartsArray.removeAt(i);
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

    const v = this.form.value;
    const payload: ServiceReportRequest = {
      maintenanceId: this.maintenanceId,
      diagnosis: v.diagnosis,
      activitiesPerformed: v.activitiesPerformed,
      observations: v.observations || '',
      sparePartsUsed: this.hasSpares
        ? v.sparePartsUsed.filter((r: SparePartItem) => r.description?.trim())
        : [],
    };

    this.reportsService.createServiceReport(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = `Reporte generado correctamente. PDF: ${res.body?.pdfPath ?? ''}`;
        this.form.reset();
        this.sparePartsArray.clear();
        this.hasSpares = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error al generar el reporte.';
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/mantenimiento/lista']);
  }
}
