import { AbstractControl, ValidationErrors } from '@angular/forms';

export function letterValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  if (!regex.test(value)) {
    return { letter: true };
  }

  return null;
}
