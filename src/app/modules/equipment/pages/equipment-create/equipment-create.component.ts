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
import Swal from 'sweetalert2';
import { AuthService } from 'app/core/services/auth.service';

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
    private authService: AuthService,
  ) {}

  private readonly DRAFT_KEY = 'equipment_create_draft';
  ngOnInit(): void {
    this.loadCatalogs();
    this.loadDraft();
    // Asignar el ID del usuario logueado desde el JWT
    const userId = this.authService.currentUser?.sub;
    if (userId) {
      this.form.responsibleUserId = Number(userId);
    }
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

    Swal.fire({
      icon: 'question',
      title: '¿Registrar equipo?',
      text: 'Se guardará el nuevo equipo médico en el sistema.',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        popup: 'sigebi-popup',
        confirmButton: 'sigebi-confirm-btn',
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.saving = true;

      this.equipmentsService.create(this.form).subscribe({
        next: () => {
          this.saving = false;
          sessionStorage.removeItem(this.DRAFT_KEY);

          Swal.fire({
            icon: 'success',
            title: 'Equipo registrado correctamente',
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          }).then(() => {
            this.router.navigate(['/equipment']);
          });
        },
        error: (err: any) => {
          this.saving = false;

          const msg =
            err?.error?.message ?? 'Ocurrió un error al registrar el equipo';
          const isDuplicate = err?.status === 409;

          Swal.fire({
            icon: 'error',
            title: isDuplicate ? 'Serie duplicada' : 'Error al registrar',
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

  clear(): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Limpiar formulario?',
      text: 'Se perderán todos los datos ingresados.',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        popup: 'sigebi-popup',
        confirmButton: 'sigebi-confirm-btn',
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      sessionStorage.removeItem(this.DRAFT_KEY);
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
        responsibleUserId: Number(this.authService.currentUser?.sub) || null, // 👈
      };
      this.errorMessage = '';
      this.successMessage = '';
    });
  }

  goBack(): void {
    Swal.fire({
      icon: 'info',
      title: 'Puedes cerrar esta pestaña',
      text: 'Los cambios no guardados se perderán.',
      confirmButtonText: 'Entendido',
      buttonsStyling: false,
      customClass: {
        popup: 'sigebi-popup',
        confirmButton: 'sigebi-confirm-btn',
      },
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
    if (!this.form.brand.trim()) {
      // 👈 agregar
      this.errorMessage = 'La marca es requerida';
      return false;
    }
    if (!this.form.model.trim()) {
      // 👈 agregar
      this.errorMessage = 'El modelo es requerido';
      return false;
    }
    if (!this.form.invima.trim()) {
      // 👈 agregar
      this.errorMessage = 'El registro INVIMA es requerido';
      return false;
    }
    if (!this.form.acquisitionDate) {
      // 👈 agregar
      this.errorMessage = 'La fecha de adquisición es requerida';
      return false;
    }
    if (!this.form.providerId) {
      // 👈 agregar
      this.errorMessage = 'El proveedor es requerido';
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
    if (!this.form.responsibleUserId) {
      // 👈 agregar (resolver el TODO)
      this.errorMessage = 'Falta el usuario responsable';
      return false;
    }
    return true;
  }
}
