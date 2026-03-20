import { Component } from '@angular/core';
import { ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
})
export class ProviderFormComponent {
  constructor(public service: ProviderService) {}
}
