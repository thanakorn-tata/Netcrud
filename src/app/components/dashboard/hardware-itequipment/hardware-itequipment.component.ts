import { Component} from '@angular/core';
import { ImplementationAssetComponent } from './implementation-asset/implementation-asset.component';
import { AmountAssetComponent } from './amount-asset/amount-asset.component';
import { ComputerStatusComponent } from './computer-status/computer-status.component';
import { Last5changedComputerComponent } from './last5changed-computer/last5changed-computer.component';
import { Last5nearexpiredComponent } from './last5nearexpired/last5nearexpired.component';
import { Last5newAssetsComponent } from './last5new-assets/last5new-assets.component';
import { Last5expiredComponent } from './last5expired/last5expired.component';

@Component({
  selector: 'app-hardware-itequipment',
  imports: [ImplementationAssetComponent, AmountAssetComponent, ComputerStatusComponent,
            Last5changedComputerComponent, Last5nearexpiredComponent, Last5newAssetsComponent,
            Last5expiredComponent
  ],
  templateUrl: './hardware-itequipment.component.html',
  styleUrls: ['./hardware-itequipment.component.scss']
})
export class HardwareITequipmentComponent  {

}

