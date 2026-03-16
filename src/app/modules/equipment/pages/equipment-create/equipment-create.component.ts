import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EquipmentsService } from '../../services/equipments.service';
import { AreaService } from '../../services/area.service';
import { ClasificationService } from '../../services/clasification.service';
import { ProviderService } from '../../services/provider.service';
import { StateService } from '../../services/state.service';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-equipment-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipment-create.component.html',
})
export class EquipmentCreateComponent implements OnInit {
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  // Catálogos para selects
  areas: any[] = [];
  classifications: any[] = [];
  providers: any[] = [];
  states: any[] = [];
  locations: any[] = [];

  maintenanceOptions = [
    { value: 1, label: 'Mensual' },
    { value: 2, label: 'Bimestral' },
    { value: 3, label: 'Trimestral' },
    { value: 6, label: 'Semestral' },
    { value: 12, label: 'Anual' },
  ];

  riskLevels = [
    { value: 'BAJO', label: 'Bajo' },
    { value: 'MEDIO', label: 'Medio' },
    { value: 'ALTO', label: 'Alto' },
    { value: 'MUY_ALTO', label: 'Muy Alto' },
  ];

  form = {
    // Datos Generales
    name: '',
    brand: '',
    model: '',
    serie: '',
    invima: '',
    // Ubicación
    areaId: null as number | null,
    locationId: null as number | null,
    // Técnico
    classificationId: null as number | null,
    stateId: null as number | null,
    riskLevel: '',
    // Mantenimiento
    providerId: null as number | null,
    maintenanceFrequency: null as number | null,
    calibrationFrequency: null as number | null,
    // Adquisición
    acquisitionDate: '',
    usefulLife: null as number | null,
    warrantyEnd: '',
    // Auditoría
    responsibleUserId: null as number | null, // createdBy — viene del usuario logueado
  };

  constructor(
    private router: Router,
    private equipmentsService: EquipmentsService,
    private areaService: AreaService,
    private clasificationService: ClasificationService,
    private providerService: ProviderService,
    private stateService: StateService,
    private locationService: LocationService,
  ) {}

  ngOnInit(): void {
    this.loadCatalogs();
    // TODO: asignar el ID del usuario logueado
    // this.form.responsibleUserId = this.authService.currentUser.id;
  }

  loadCatalogs(): void {
    this.loading = true;

    this.areaService.getAll().subscribe({
      next: (res: any) => (this.areas = res.body?.content ?? res.body ?? []),
      error: () => (this.errorMessage = 'Error cargando áreas'),
    });

    this.clasificationService.getAll().subscribe({
      next: (res: any) =>
        (this.classifications = res.body?.content ?? res.body ?? []),
      error: () => {},
    });

    this.providerService.getAll().subscribe({
      next: (res: any) =>
        (this.providers = res.body?.content ?? res.body ?? []),
      error: () => {},
    });

    this.stateService.getAll().subscribe({
      next: (res: any) => (this.states = res.body?.content ?? res.body ?? []),
      error: () => {},
    });

    this.locationService.getAll().subscribe({
      next: (res: any) => {
        this.locations = res.body?.content ?? res.body ?? [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  save(): void {
    if (!this.isFormValid()) return;

    this.saving = true;
    this.errorMessage = '';

    this.equipmentsService.create(this.form).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Equipo registrado exitosamente';
        setTimeout(() => this.router.navigate(['/equipment']), 1500);
      },
      error: (err: any) => {
        this.saving = false;
        this.errorMessage =
          err?.error?.message ?? 'Error al registrar el equipo';
      },
    });
  }

  clear(): void {
    this.form = {
      name: '',
      brand: '',
      model: '',
      serie: '',
      invima: '',
      areaId: null,
      locationId: null,
      classificationId: null,
      stateId: null,
      riskLevel: '',
      providerId: null,
      maintenanceFrequency: null,
      calibrationFrequency: null,
      acquisitionDate: '',
      usefulLife: null,
      warrantyEnd: '',
      responsibleUserId: this.form.responsibleUserId,
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/equipment']);
  }

  private isFormValid(): boolean {
    if (!this.form.name.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return false;
    }
    if (!this.form.serie.trim()) {
      this.errorMessage = 'La serie es requerida';
      return false;
    }
    if (!this.form.areaId) {
      this.errorMessage = 'El área es requerida';
      return false;
    }
    if (!this.form.stateId) {
      this.errorMessage = 'El estado es requerido';
      return false;
    }
    if (!this.form.locationId) {
      this.errorMessage = 'La ubicación es requerida';
      return false;
    }
    if (!this.form.classificationId) {
      this.errorMessage = 'La clasificación es requerida';
      return false;
    }
    return true;
  }
}
