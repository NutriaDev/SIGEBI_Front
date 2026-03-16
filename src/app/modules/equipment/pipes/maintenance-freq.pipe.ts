import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'maintenanceFreq', standalone: true })
export class MaintenanceFreqPipe implements PipeTransform {
  transform(value: number): string {
    if (value === 1) return 'Mensual';
    if (value === 3) return 'Trimestral';
    if (value === 6) return 'Semestral';
    if (value === 12) return 'Anual';
    return `Cada ${value} meses`;
  }
}
