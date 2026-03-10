import { Component, OnInit } from '@angular/core';
import { AreaService } from '../../services/area.service';
import { Area } from '../../models/area';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
})
export class AreaFormComponent implements OnInit {
  viewMode: 'list' | 'create' | 'update' | null = null;

  areas: any[] = [];
  selectedArea: any = null;
  searchText = '';
  newAreaName = '';

  constructor(private areaService: AreaService) {}

  ngOnInit(): void {
    this.loadAreas();
  }

  loadAreas() {
    this.areaService.getAllAreas().subscribe((res) => {
      this.areas = res;
    });
  }

  showAreas() {
    this.viewMode = 'list';
    this.loadAreas();
  }

  showCreate() {
    this.viewMode = 'create';
  }

  showUpdate() {
    this.viewMode = 'update';
  }

  selectArea(area: any) {
    this.selectedArea = area;
    this.viewMode = 'update';
  }

  createArea() {
    console.log('Crear area', this.newAreaName);
  }

  updateArea() {
    if (!this.selectedArea) return;

    this.areaService
      .updateArea(this.selectedArea.areaId, this.searchText)
      .subscribe(() => {
        this.loadAreas();
        this.selectedArea = null;
        this.searchText = '';
      });
  }

  deactivateArea() {
    console.log('Desactivar area', this.selectedArea);
  }
}
