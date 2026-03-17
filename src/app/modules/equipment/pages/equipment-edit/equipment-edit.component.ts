import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentsService } from '../../services/equipments.service';
import { AreaService } from '../../services/area.service';
import { ClasificationService } from '../../services/clasification.service';
import { ProviderService } from '../../services/provider.service';
import { StateService } from '../../services/state.service';
import { LocationService } from '../../services/location.service';
import { AuthService } from 'app/core/services/auth.service';
import { HttpErrorMapperService } from 'app/core/services/http-error-mapper.service';
import { Equipment } from '../../models/equipment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipment-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipment-edit.component.html',
})
export class EquipmentEditComponent implements OnInit, OnDestroy {
  @Input() equipmentId?: number;

  loading = false;
  saving = false;
  errorMessage = '';

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
    serie: '',
    name: '',
    brand: '',
    model: '',
    invima: '',
    areaId: null as number | null,
    locationId: null as number | null,
    classificationId: null as number | null,
    stateId: null as number | null,
    riskLevel: '',
    providerId: null as number | null,
    maintenanceFrequency: null as number | null,
    calibrationFrequency: null as number | null,
    acquisitionDate: '',
    usefulLife: null as number | null,
    warrantyEnd: '',
    active: true,
    updatedBy: null as number | null,
  };

  private readonly DRAFT_KEY = 'equipment_edit_draft';

  constructor(
    private equipmentsService: EquipmentsService,
    private areaService: AreaService,
    private clasificationService: ClasificationService,
    private providerService: ProviderService,
    private stateService: StateService,
    private locationService: LocationService,
    private authService: AuthService,
    private errorMapper: HttpErrorMapperService,
  ) {}

  ngOnInit(): void {
    this.loadCatalogs();
    this.loadDraft();

    const userId = this.authService.currentUser?.sub;
    if (userId) {
      this.form.updatedBy = Number(userId);
    }

    if (this.equipmentId) {
      this.loadEquipment(this.equipmentId);
    }
  }

  ngOnDestroy(): void {
    this.saveDraft();
  }

  saveDraft(): void {
    sessionStorage.setItem(this.DRAFT_KEY, JSON.stringify(this.form));
  }

  private loadDraft(): void {
    const draft = sessionStorage.getItem(this.DRAFT_KEY);
    if (draft) {
      this.form = { ...this.form, ...JSON.parse(draft) };
    }
  }

  loadEquipment(id: number): void {
    this.loading = true;
    this.equipmentsService.getById(id).subscribe({
      next: (res: any) => {
        const eq: Equipment = res.body;
        this.form = {
          serie: eq.serie ?? '',
          name: eq.name ?? '',
          brand: eq.brand ?? '',
          model: eq.model ?? '',
          invima: eq.invima ?? '',
          areaId: eq.areaId ?? null,
          locationId: eq.locationId ?? null,
          classificationId: eq.classificationId ?? null,
          stateId: eq.stateId ?? null,
          riskLevel: eq.riskLevel ?? '',
          providerId: eq.providerId ?? null,
          maintenanceFrequency: eq.maintenanceFrequency ?? null,
          calibrationFrequency: eq.calibrationFrequency ?? null,
          acquisitionDate: eq.acquisitionDate
            ? new Date(eq.acquisitionDate).toISOString().split('T')[0]
            : '',
          usefulLife: eq.usefulLife ?? null,
          warrantyEnd: eq.warrantyEnd
            ? new Date(eq.warrantyEnd).toISOString().split('T')[0]
            : '',
          active: eq.active ?? true,
          updatedBy: Number(this.authService.currentUser?.sub) || null,
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar equipo',
          text: 'No se pudo obtener la información del equipo.',
          confirmButtonText: 'Entendido',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });
      },
    });
  }

  loadCatalogs(): void {
    this.areaService.getActive().subscribe({
      next: (res: any) => (this.areas = res.body?.content ?? res.body ?? []),
      error: () => {},
    });
    this.clasificationService.getActive().subscribe({
      next: (res: any) =>
        (this.classifications = res.body?.content ?? res.body ?? []),
      error: () => {},
    });
    this.providerService.getActive().subscribe({
      next: (res: any) =>
        (this.providers = res.body?.content ?? res.body ?? []),
      error: () => {},
    });
    this.stateService.getActive().subscribe({
      next: (res: any) => (this.states = res.body?.content ?? res.body ?? []),
      error: () => {},
    });
    this.locationService.getActive().subscribe({
      next: (res: any) =>
        (this.locations = res.body?.content ?? res.body ?? []),
      error: () => {},
    });
  }

  save(): void {
    if (!this.isFormValid()) return;
    if (!this.equipmentId) return;

    Swal.fire({
      icon: 'question',
      title: '¿Actualizar equipo?',
      text: 'Se guardarán los cambios del equipo médico.',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        popup: 'sigebi-popup',
        confirmButton: 'sigebi-confirm-btn',
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.saving = true;

      this.equipmentsService.update(this.equipmentId!, this.form).subscribe({
        next: () => {
          this.saving = false;
          sessionStorage.removeItem(this.DRAFT_KEY);

          Swal.fire({
            icon: 'success',
            title: 'Equipo actualizado correctamente',
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });
        },
        error: (err: any) => {
          this.saving = false;
          const msg = this.errorMapper.mapUpdateEquipmentError(err);
          Swal.fire({
            icon: 'error',
            title:
              err?.status === 409 ? 'Serie duplicada' : 'Error al actualizar',
            text: msg,
            confirmButtonText: 'Entendido',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });
        },
      });
    });
  }

  toggleActive(): void {
    if (!this.equipmentId) return;

    const action = this.form.active ? 'inactivar' : 'activar';

    Swal.fire({
      icon: 'warning',
      title: `¿${this.form.active ? 'Inactivar' : 'Activar'} equipo?`,
      text: `¿Deseas ${action} este equipo?`,
      showCancelButton: true,
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        popup: 'sigebi-popup',
        confirmButton: 'sigebi-confirm-btn',
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      const request$ = this.form.active
        ? this.equipmentsService.deactivate(this.equipmentId!)
        : this.equipmentsService.activate(this.equipmentId!);

      request$.subscribe({
        next: () => {
          this.form.active = !this.form.active;
          Swal.fire({
            icon: 'success',
            title: `Equipo ${this.form.active ? 'activado' : 'inactivado'} correctamente`,
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });
        },
        error: (err: any) => {
          const msg = this.errorMapper.mapToggleEquipmentError(
            err,
            action as 'activar' | 'inactivar',
          );
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: msg,
            confirmButtonText: 'Entendido',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });
        },
      });
    });
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
