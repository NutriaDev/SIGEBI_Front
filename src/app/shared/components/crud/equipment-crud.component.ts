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

  private getId(): number {
    return (
      this.selected?.id ??
      this.selected?.areaId ??
      this.selected?.classificationId ??
      this.selected?.stateId
    );
  }

  load() {
    this.service.getAll().subscribe((res: any) => {
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
    console.log('item seleccionado:', item);
    this.selected = { ...item };
    this.viewMode = 'update';
  }

  update() {
    const id = this.getId();
    console.log('update id:', id);
    this.service.update(id, { name: this.selected.name }).subscribe(() => {
      this.viewMode = 'list';
      this.load();
    });
  }

  deactivate() {
    const id = this.getId();
    console.log('deactivate id:', id);
    this.service.deactivate(id).subscribe(() => {
      this.selected.active = !this.selected.active; // toggle local
      this.viewMode = 'list';
      this.load();
    });
  }
}
