import { Component, OnInit } from '@angular/core';
import { ClasificationService } from '../../services/clasification.service';
import { Classification } from '../../models/clasification';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clasification-form',
  templateUrl: './clasification-form.component.html',
})
export class ClasificationFormComponent implements OnInit {
  viewMode: 'list' | 'create' | 'update' | null = 'list';

  classifications: Classification[] = [];
  searchText = '';
  searchId!: number;
  selectedClassification: Classification | null = null;

  constructor(private clasificationService: ClasificationService) {}

  ngOnInit(): void {
    this.showClasifications();
  }

  loadClasification() {
    this.clasificationService.getAllClassifications().subscribe((res: any) => {
      this.classifications = res.body.content;
    });
  }

  showClasifications() {
    this.viewMode = 'list';
    this.loadClasification();
  }

  showCreate() {
    this.viewMode = 'create';
  }

  selectClassification(classification: Classification) {
    this.selectedClassification = classification;
    this.viewMode = 'update';
  }

  searchClasificationByName() {
    if (!this.searchText) return;

    this.clasificationService
      .getClassificationByName(this.searchText)
      .subscribe({
        next: (res) => {
          const clasification = res.body;

          Swal.fire({
            icon: clasification.active ? 'success' : 'warning',
            title: clasification.name,
            text: clasification.active
              ? 'Clasificación activada'
              : 'Clasificación desactivada',
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
              popup: 'sigebi-popup',
              confirmButton: 'sigebi-confirm-btn',
            },
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Clasificación no encontrada',
            text: 'No existe una clasificación con ese nombre',
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

  searchClasificationById() {}
}
