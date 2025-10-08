import { Component } from '@angular/core';
import { PrimeNgSharedModule } from "../../../shared/prime-ng-shared.module";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  imports: [PrimeNgSharedModule]
})
export class StudentComponent {
  onSearch() {
    // TODO: implement search logic
  }

  onClear() {
    // TODO: implement clear logic
  }

  openPage(page: string) {
    // TODO: implement navigation logic
  }
}
