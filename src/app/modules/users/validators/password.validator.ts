import { AbstractControl, ValidationErrors } from '@angular/forms';

export function strongPasswordValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const errors: any = {};

  if (value.length < 8) {
    errors.minLength = true;
  }

  if (!/[A-Z]/.test(value)) {
    errors.uppercase = true;
  }

  if (!/[0-9]/.test(value)) {
    errors.number = true;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    errors.specialChar = true;
  }

  return Object.keys(errors).length ? errors : null;
}
