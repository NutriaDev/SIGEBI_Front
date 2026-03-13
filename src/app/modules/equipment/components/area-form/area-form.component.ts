import { Component } from '@angular/core';
import { AreaService } from '../../services/area.service';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
})
export class AreaFormComponent {
  constructor(public service: AreaService) {}
}
