import { Component } from '@angular/core';
// import { PrimeNgSharedModule } from '../../../../../shared/prime-ng-shared/prime-ng-shared.module';
import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { GlobalService } from '../../../../../services/global.service';
import { TablePageEvent } from 'primeng/table';
// import { MODE_PAGE } from '../../../../common';
import { Router } from '@angular/router';
import { PrimeNgSharedModule } from '../../../shared/prime-ng-shared.module';

@Component({
  selector: 'app-budget',
  imports: [PrimeNgSharedModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
})
export class BudgetComponent {
  //  mode: MODE_PAGE = 'search';
  menuCode: string = '';

  criteria: any = {};

  items: any[] = [];

  rows: number = 5;
  totalRecords: number = 0;

  constructor(
    private readonly loaderService: NgxUiLoaderService,
    // public readonly globalService: GlobalService,
    private readonly router: Router
  ) {}
  ngOnInit() {
    this.items = [
      {
        no: 1,
        budgetType: 'งบประมาณทั่วไป',
        description: 'งบประมาณสำหรับโครงการวิจัย',
        status: 'ใช้งาน',
      },
      {
        no: 2,
        budgetType: 'งบประมาณพิเศษ',
        description: 'งบสนับสนุนกิจกรรมนักศึกษา',
        status: 'ไม่ใช้งาน',
      },
    ];
    this.totalRecords = this.items.length;
  }

  onSearch(event?: TablePageEvent) {
    this.loaderService.start();
    setTimeout(() => {
      this.loaderService.stop();
    }, 200);
  }

  onClear() {
    this.onSearch();
  }
  onAddNew() {
    this.onSearch();
  }
  // openPage(page: MODE_PAGE, id?: number) {
  //     if (page === 'create') {
  //         this.router.navigate(['manage-master-data/budget-type/create']);
  //     } else if (page === 'edit') {
  //         this.router.navigate([`manage-master-data/budget-type/edit/${this.globalService.encodeIdBase64(id)}`]);
  //     } else if (page === 'view') {
  //         this.router.navigate([`manage-master-data/budget-type/view/${this.globalService.encodeIdBase64(id)}`]);
  //     }
}
