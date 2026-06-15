import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { ReportsService } from '../../services/reports.service';

type ReportType = 'INVENTORY' | 'MOVEMENTS' | 'MAINTENANCE' | 'AUDIT';
type ReportFormat = 'CSV' | 'EXCEL' | 'PDF';

@Component({
  selector: 'app-export-report-button',
  templateUrl: './export-report-button.component.html',
  styleUrl: './export-report-button.component.css',
})
export class ExportReportButtonComponent {
  @Input() reportType!: ReportType;
  @Input() title = 'Exportar reporte';

  showPopup = false;
  from = '';
  to = '';
  exporting = false;

  constructor(private reportsService: ReportsService) {}

  openPopup(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  exportReport(format: ReportFormat): void {
    if (!this.from || !this.to) {
      Swal.fire({
        icon: 'warning',
        title: 'Fechas requeridas',
        text: 'Selecciona una fecha de inicio y una fecha final.',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false,
        customClass: {
          popup: 'sigebi-popup',
          confirmButton: 'sigebi-confirm-btn',
        },
      });
      return;
    }

    this.exporting = true;

    this.reportsService.exportDirect({
      type: this.reportType,
      from: this.from,
      to: this.to,
      format,
    }).subscribe({
      next: (blob) => {
        // Verificar que sea un blob válido con contenido
      if (!blob || blob.size === 0) {
        this.exporting = false;
        Swal.fire({
          icon: 'warning',
          title: 'Sin datos',
          text: 'No hay datos para exportar en el rango de fechas seleccionado.',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: { popup: 'sigebi-popup', confirmButton: 'sigebi-confirm-btn' }
        });
        return;
      }
        const extension = format === 'EXCEL' ? 'xlsx' : format.toLowerCase();
        const fileName = `${this.reportType.toLowerCase()}-${this.from}-${this.to}.${extension}`;

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = fileName;
        link.click();

        window.URL.revokeObjectURL(url);

        this.exporting = false;
        this.showPopup = false;
      },
      error: (err) => {
      this.exporting = false;

      // Leer el mensaje de error del blob de error
      if (err.error instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result as string);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: json.message ?? 'No se pudo generar el reporte.',
              confirmButtonText: 'Aceptar',
              buttonsStyling: false,
              customClass: { popup: 'sigebi-popup', confirmButton: 'sigebi-confirm-btn' }
            });
          } catch {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo generar el reporte.',
              confirmButtonText: 'Aceptar',
              buttonsStyling: false,
              customClass: { popup: 'sigebi-popup', confirmButton: 'sigebi-confirm-btn' }
            });
          }
        };
        reader.readAsText(err.error);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo generar el reporte.',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: { popup: 'sigebi-popup', confirmButton: 'sigebi-confirm-btn' }
        });
      }
    }
      });
  }
}