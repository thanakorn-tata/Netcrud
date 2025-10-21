import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { TranslateModule} from '@ngx-translate/core';

import { ItemsTest_changedcom } from '../../../../services/items-test';
import { ItemsTestService } from '../../../../services/items-test-service';

@Component({
  selector: 'app-last5changed-computer',
  imports: [TableModule, CommonModule, TranslateModule],
  templateUrl: './last5changed-computer.component.html',
  styleUrl: './last5changed-computer.component.scss'
})
export class Last5changedComputerComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  itemstest: ItemsTest_changedcom[] = [];
  initialValue: ItemsTest_changedcom[] = [];
  isSorted: boolean | null = null;

  constructor(private ItemsTestService: ItemsTestService) {}

  ngOnInit() {
      this.ItemsTestService.getItemsMini().then((data) => {
          this.itemstest = data;
          this.initialValue = [...data];
      });
  }

  customSort(event: SortEvent) {
      if (this.isSorted === null || this.isSorted === undefined) {
          this.isSorted = true;
          this.sortTableData(event);
      } else if (this.isSorted === true) {
          this.isSorted = false;
          this.sortTableData(event);
      } else {
          this.isSorted = null;
          this.itemstest = [...this.initialValue];
          if (this.dt) {
              this.dt.reset();
          }
      }
  }

  private sortTableData(event: SortEvent) {
      if (!event.data || !event.field) return;

      event.data.sort((data1, data2) => {
          let value1 = data1[event.field as keyof ItemsTest_changedcom];
          let value2 = data2[event.field as keyof ItemsTest_changedcom];
          let result = null;

          if (value1 == null && value2 != null) {
              result = -1;
          } else if (value1 != null && value2 == null) {
              result = 1;
          } else if (value1 == null && value2 == null) {
              result = 0;
          } else if (typeof value1 === 'string' && typeof value2 === 'string') {
              result = value1.localeCompare(value2);
          } else {
              result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
          }

          return (event.order || 1) * result;
      });
  }
}
