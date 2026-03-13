import { Component } from '@angular/core';
import { ClasificationService } from '../../services/clasification.service';

@Component({
  selector: 'app-clasification-form',
  templateUrl: './clasification-form.component.html',
})
export class ClasificationFormComponent {
  constructor(public service: ClasificationService) {}
}
