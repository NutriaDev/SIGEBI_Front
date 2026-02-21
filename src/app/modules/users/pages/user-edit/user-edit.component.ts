import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { strongPasswordValidator } from '../../validators/password.validator';
import { letterValidator } from '../../validators/letter.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent {
  userForm: FormGroup;
  loading = false;

  showPassword = false;
  showConfirmPassword = false;

  searchId!: number;
  searchEmail!: string;

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

  mapRoleNameToId(roleName: string): number | null {
    const roles: any = {
      SUPERADMIN: 1,
      ADMIN: 2,
      SUPERVISOR: 3,
      TECNICO: 4,
    };
    return roles[roleName] ?? null;
  }
  fillForm(user: any) {
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

  searchById() {
    if (!this.searchId) return;

    this.loading = true;

    this.usersService.getUserById(this.searchId).subscribe({
      next: (response) => {
        this.fillForm(response.body);
        this.loading = false;
      },
      error: () => {
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
      },
    });
  }

  searchByEmail() {
    if (!this.searchEmail) return;
    this.loading = true;
    this.usersService.getUserByEmail(this.searchEmail).subscribe({
      next: (response) => {
        this.fillForm(response.body);
        this.loading = false;
      },
      error: () => {
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
      },
    });
  }

  // submit() {
  //   if (this.userForm.invalid) {
  //     this.userForm.markAllAsTouched();
  //     return;
  //   }

  //   this.loading = true;
  //   this.usersService.update(this.userForm.value).subscribe({
  //     next: () => {
  //       this.loading = false;
  //       this.userForm.reset();
  //       this.router.navigate(['/users']);
  //     },
  //     error: () => {
  //       this.loading = false;
  //     },
  //   });
  // }
}
