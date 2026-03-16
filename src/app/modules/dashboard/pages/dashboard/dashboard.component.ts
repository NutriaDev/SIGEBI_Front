import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TabService } from '../../services/tab.service';
import { EquipmentLifecycleComponent } from 'app/modules/equipment/pages/equipment-lifecycle/equipment-lifecycle.component';
import { EquipmentCreateComponent } from 'app/modules/equipment/pages/equipment-create/equipment-create.component';

@Component({
  selector: 'app-dashboard',
  template: ` <router-outlet></router-outlet> `,
})
export class DashboardComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private tabService: TabService,
  ) {}

  ngOnInit(): void {
    const roles = this.authService.getRoles();
    const role = roles && roles.length > 0 ? roles[0] : '';

    switch (role) {
      case 'SUPERADMIN':
        this.router.navigate(['dashboard/superadmin']);
        break;

      case 'ADMIN':
        this.router.navigate(['dashboard/admin']);
        break;

      case 'SUPERVISOR':
        this.router.navigate(['dashboard/supervisor']);
        break;

      case 'TECNICO':
        this.router.navigate(['dashboard/tecnico']);
    }
  }

  openEquipment() {
    this.tabService.openTab('Equipment Lifecycle', EquipmentLifecycleComponent);
  }
}
