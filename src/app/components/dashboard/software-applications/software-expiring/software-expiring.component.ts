import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';

import { ItemTest_expiring } from '../../../../services/items-test';
import { ItemsTestExpiring } from '../../../../services/items-expiring-service';

@Component({
  selector: 'app-software-expiring',
  standalone: true,
  imports: [TranslateModule, CommonModule, TableModule],
  templateUrl: './software-expiring.component.html',
  styleUrl: './software-expiring.component.scss'
})
export class SoftwareExpiringComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  itemstest: ItemTest_expiring[] = [];
  initialValue: ItemTest_expiring[] = [];

  constructor(private itemsTestExpiring: ItemsTestExpiring) {}

  ngOnInit() {
    this.itemsTestExpiring.getItemsMini().then((data) => {
      this.itemstest = data;
      this.initialValue = [...data];
    });
  }

  customSort(event: SortEvent) {
    if (!event.data || !event.field || event.order === undefined) return;

    event.data.sort((a, b) => {
      const value1 = a[event.field as keyof ItemTest_expiring];
      const value2 = b[event.field as keyof ItemTest_expiring];

      let result = 0;
      if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else {
        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      }

      return (event.order ?? 1) * result;
    });
  }
}
