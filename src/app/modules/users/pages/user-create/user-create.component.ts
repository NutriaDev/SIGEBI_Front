import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
})
export class UserCreateComponent {
  userForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
  ) {
    this.userForm = this.fb.group({
      role: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: [''],
      phone: [''],
      document: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      entity: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  submit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos obligatorios.',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false,
        customClass: {
          popup: 'sigebi-popup',
          confirmButton: 'sigebi-confirm-btn',
        },
      });

      return;
    }

    if (this.userForm.value.password !== this.userForm.value.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseñas no coinciden',
        text: 'Verifica que ambas contraseñas sean iguales.',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false,
        customClass: {
          popup: 'sigebi-popup',
          confirmButton: 'sigebi-confirm-btn',
        },
      });
      return;
    }

    const payload = {
      idRole: Number(this.userForm.value.role),
      name: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      birthDate: this.userForm.value.birthDate,
      phone: this.userForm.value.phone,
      id: Number(this.userForm.value.document),
      email: this.userForm.value.email,
      companyId: Number(this.userForm.value.entity),
      password: this.userForm.value.password,
    };

    this.loading = true;

    this.usersService.createUser(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'El usuario fue registrado correctamente.',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'sigebi-popup',
            confirmButton: 'sigebi-confirm-btn',
          },
        });

        this.userForm.reset();
        this.loading = false;
      },
      error: (err) => {
        let message = 'Error al crear usuario';

        if (err.status === 409) {
          message = 'El correo ya existe.';
        } else if (err.status === 400) {
          message = err.error?.message || 'Datos inválidos.';
        } else if (err.status === 403) {
          message = 'No tienes permisos para crear usuarios.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
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
