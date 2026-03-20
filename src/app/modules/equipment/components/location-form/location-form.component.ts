import { Component } from '@angular/core';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
})
export class LocationFormComponent {
  constructor(public service: LocationService) {}
}
