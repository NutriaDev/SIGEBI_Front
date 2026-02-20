import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';

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
      return;
    }

    // 🔥 VALIDACIÓN DE CONTRASEÑAS
    if (this.userForm.value.password !== this.userForm.value.confirmPassword) {
      alert('Las contraseñas no coinciden');
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

    console.log('Payload enviado:', payload);

    this.usersService.createUser(payload).subscribe({
      next: (res) => {
        console.log(res);
        alert('Usuario creado correctamente');
        this.userForm.reset();
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear usuario');
      },
    });
  }
}
