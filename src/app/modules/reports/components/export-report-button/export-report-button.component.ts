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
      error: () => {
        this.exporting = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo generar el reporte.',
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
}