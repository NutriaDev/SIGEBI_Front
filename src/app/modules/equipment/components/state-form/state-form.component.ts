import { Component } from '@angular/core';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-state-form',
  templateUrl: './state-form.component.html',
})
export class StateFormComponent {
  constructor(public service: StateService) {}
}
