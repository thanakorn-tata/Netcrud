import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { TranslateModule} from '@ngx-translate/core'; 

import { ItemTest_empty } from '../../../../services/test/items-test';
import { ItemsTestService2 } from '../../../../services/test/items-test2-service';

@Component({
  selector: 'app-software-expired',
  imports: [TranslateModule, CommonModule, TableModule],
  templateUrl: './software-expired.component.html',
  styleUrl: './software-expired.component.scss'
})
export class SoftwareExpiredComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  itemstest: ItemTest_empty[] = [];
  initialValue: ItemTest_empty[] = [];
  isSorted: boolean | null = null;

  constructor(private ItemsTestService2: ItemsTestService2) {}

  ngOnInit() {
      this.ItemsTestService2.getItemsMini().then((data) => {
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
          let value1 = data1[event.field as keyof ItemTest_empty];
          let value2 = data2[event.field as keyof ItemTest_empty];
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