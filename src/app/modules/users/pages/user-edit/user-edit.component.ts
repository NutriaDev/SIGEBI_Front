import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { strongPasswordValidator } from '../../validators/password.validator';
import { letterValidator } from '../../validators/letter.validator';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent {
  userForm: FormGroup;
  loading = false;

  showPassword = false;
  showConfirmPassword = false;

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
