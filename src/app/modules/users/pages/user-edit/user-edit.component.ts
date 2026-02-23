import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { strongPasswordValidator } from '../../validators/password.validator';
import { letterValidator } from '../../validators/letter.validator';
import Swal from 'sweetalert2';
import { TabService } from 'app/modules/dashboard/services/tab.service';
import { HttpErrorMapperService } from 'app/core/services/http-error-mapper.service';

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
  @Input() toogleUserStatus?: boolean;
  @Input() toogleUserDelete?: boolean;
  activeTabIndex: any;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private tabService: TabService,
    private httpErrorMapperService: HttpErrorMapperService,
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
      error: (error) => {
        const message = this.httpErrorMapperService.mapGetUserByIdError(error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });

        this.loading = false;
      },
    });
  }

  // 🔵 Cargar por Email manual
  searchByEmail() {
    if (!this.searchEmail) return;
    this.loadUserByEmail(this.searchEmail);
  }

  deleteUserHard() {
    if (!this.currentUserId) return;

    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        popup: 'sigebi-popup',
        confirmButton: 'sigebi-confirm-btn',
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.loading = true;

      this.usersService.deleteUserHard(this.currentUserId).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado correctamente',
            confirmButtonText: 'Aceptar',
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });

          // 🔥 Aquí deberías cerrar el tab
          // o redirigir a lista
          this.tabService.closeTab(this.activeTabIndex);
        },
        error: (error) => {
          const message = this.httpErrorMapperService.mapDeleteUserError(error);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });

          this.loading = false;
        },
      });
    });
  }

  toggleUserStatusMethod() {
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
        error: (error) => {
          const message =
            this.httpErrorMapperService.mapDeactivateUserError(error);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });

          this.loading = false;
        },
      });
    });
  }

  toggleUserDeleteMethod() {
    if (!this.currentUserId) return;

    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        popup: 'sigebi-popup',
        confirmButton: 'sigebi-confirm-btn',
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.loading = true;

      this.usersService.deleteUserHard(this.currentUserId).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado correctamente',
            confirmButtonText: 'Aceptar',
          });

          this.loading = false;

          this.tabService.closeTab(this.activeTabIndex);
        },
        error: (error) => {
          const message = this.httpErrorMapperService.mapDeleteUserError(error);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });

          this.loading = false;
        },
      });
    });
  }

  // 🔵 Método reutilizable
  loadUserByEmail(email: string) {
    this.loading = true;

    this.usersService.getUserByEmail(email).subscribe({
      next: (response) => {
        this.fillForm(response.body);
        this.loading = false;

        if (this.toogleUserStatus) {
          setTimeout(() => {
            this.toggleUserStatusMethod();
          }, 100);
        }

        if (this.toogleUserDelete) {
          setTimeout(() => {
            this.toggleUserDeleteMethod();
          }, 100);
        }
      },
      error: (error) => {
        const message =
          this.httpErrorMapperService.mapGetUserByEmailError(error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });

        this.loading = false;
      },
    });
  }

  onSubmit() {
    console.log('SUBMIT EJECUTADO');
    console.log('Form valid:', this.userForm.valid);
    console.log('User ID:', this.currentUserId);
    if (this.userForm.invalid || !this.currentUserId) return;

    this.loading = true;

    const payload = {
      name: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      birthDate: this.userForm.value.birthDate,
      phone: this.userForm.value.phone,
      email: this.userForm.value.email,
      companyId: this.userForm.value.entity,
    };
    this.usersService.updateUser(this.currentUserId, payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado correctamente',
          confirmButtonText: 'Aceptar',
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });
        this.loading = false;
      },
      error: (error) => {
        const message = this.httpErrorMapperService.mapUpdateUserError(error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });

        this.loading = false;
      },
    });
  }
}
