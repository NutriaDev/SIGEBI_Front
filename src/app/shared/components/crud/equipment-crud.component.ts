import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-equipment-crud',
  templateUrl: './equipment-crud.component.html',
})
export class EquipmentCrudComponent implements OnInit {
  @Input() service: any;
  @Input() title: string = '';

  items: any[] = [];
  newName = '';
  selected: any = null;
  searchText = '';
  searchId: number | null = null;

  viewMode: 'list' | 'create' | 'update' = 'list';

  constructor() {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe((res: any) => {
      // classifications: res.body.content (paginado)
      // states, areas, etc: res.body directamente (lista simple)
      this.items = res.body.content ?? res.body;
    });
  }

  searchByName() {
    if (!this.searchText) return;
    this.service.getByName(this.searchText).subscribe((res: any) => {
      this.items = res.body.content ?? [res.body];
      this.viewMode = 'list';
    });
  }

  searchById() {
    if (!this.searchId) return;
    this.service.getById(this.searchId).subscribe((res: any) => {
      this.items = [res.body];
      this.viewMode = 'list';
    });
  }

  create() {
    if (!this.newName) return;

    this.service.create({ name: this.newName }).subscribe(() => {
      this.newName = '';
      this.viewMode = 'list';
      this.load();
    });
  }

  select(item: any) {
    this.selected = item;
    this.viewMode = 'update';
  }

  update() {
    this.service
      .update(this.selected.id, { name: this.selected.name })
      .subscribe(() => {
        this.viewMode = 'list';
        this.load();
      });
  }

  deactivate() {
    this.service.deactivate(this.selected.id).subscribe(() => {
      this.viewMode = 'list';
      this.load();
    });
  }
}
