import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { strongPasswordValidator } from '../../validators/password.validator';
import { letterValidator } from '../../validators/letter.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit, OnChanges {
  userForm: FormGroup;
  loading = false;
  isUserActive = true;

  showPassword = false;
  showConfirmPassword = false;

  currentUserId!: number;
  searchId!: number;
  searchEmail!: string;

  @Input() email?: string;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
  ) {
    this.userForm = this.fb.group({
      role: ['', Validators.required],
      firstName: ['', [Validators.required, letterValidator]],
      lastName: ['', [Validators.required, letterValidator]],
      birthDate: [''],
      phone: [''],
      document: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      entity: ['', Validators.required],
      password: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.email) {
      this.loadUserByEmail(this.email);
    }
  }

  // 🔵 Mapeo rol string → id
  mapRoleNameToId(roleName: string): number | null {
    const roles: any = {
      SUPERADMIN: 1,
      ADMIN: 2,
      SUPERVISOR: 3,
      TECNICO: 4,
    };
    return roles[roleName] ?? null;
  }

  // 🔵 Rellenar formulario
  fillForm(user: any) {
    this.currentUserId = user.idUsers;
    this.isUserActive = user.active;

    this.userForm.patchValue({
      role: this.mapRoleNameToId(user.roleName),
      firstName: user.name,
      lastName: user.lastname,
      birthDate: user.birthDate?.split('T')[0],
      phone: user.phone,
      document: user.id,
      email: user.email,
      entity: user.companyId,
    });
  }

  // 🔵 Cargar por ID manual
  searchById() {
    if (!this.searchId) return;

    this.loading = true;

    this.usersService.getUserById(this.searchId).subscribe({
      next: (response) => {
        this.fillForm(response.body);
        this.loading = false;
      },
      error: () => this.showNotFound(),
    });
  }

  // 🔵 Cargar por Email manual
  searchByEmail() {
    if (!this.searchEmail) return;
    this.loadUserByEmail(this.searchEmail);
  }

  // 🔵 Método reutilizable
  loadUserByEmail(email: string) {
    this.loading = true;

    this.usersService.getUserByEmail(email).subscribe({
      next: (response) => {
        this.fillForm(response.body);
        this.loading = false;
      },
      error: () => this.showNotFound(),
    });
  }

  toggleUserStatus() {
    if (!this.currentUserId) return;

    const action = this.isUserActive ? 'desactiva' : 'activa';

    Swal.fire({
      icon: 'warning',
      title: `¿${action} usuario?`,
      text: `El usuario será ${action}do.`,
      showCancelButton: true,
      confirmButtonText: `Sí, ${action}r`,
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        popup: 'sigebi-popup',
        confirmButton: 'sigebi-confirm-btn',
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.loading = true;

      const request$ = this.isUserActive
        ? this.usersService.deactivateUser(this.currentUserId)
        : this.usersService.activateUser(this.currentUserId);

      request$.subscribe({
        next: (response) => {
          this.isUserActive = response.body.active;
          this.fillForm(response.body);

          Swal.fire({
            icon: 'success',
            title: `Usuario ${action}do correctamente`,
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });

          this.loading = false;
        },
        error: () => this.showNotFound(),
      });
    });
  }

  // 🔵 SweetAlert centralizado
  showNotFound() {
    this.loading = false;

    Swal.fire({
      icon: 'error',
      title: 'Usuario no encontrado',
      text: 'No se encontró usuario con ese dato.',
      confirmButtonText: 'Aceptar',
      buttonsStyling: false,
      customClass: {
        popup: 'sigebi-popup',
        confirmButton: 'sigebi-confirm-btn',
      },
    });
  }
}
