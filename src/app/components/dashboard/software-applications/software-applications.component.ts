import { Component } from '@angular/core';
import { SoftwareAssetsComponent } from './software-assets/software-assets.component';
import { SoftwareExpiringComponent } from './software-expiring/software-expiring.component';
import { SoftwareExpiredComponent } from './software-expired/software-expired.component';
@Component({
  selector: 'app-software-applications',
  imports : [SoftwareAssetsComponent, SoftwareExpiringComponent, SoftwareExpiredComponent],
  templateUrl: './software-applications.component.html',
  styleUrl: './software-applications.component.scss'
})
export class SoftwareApplicationsComponent {

}
