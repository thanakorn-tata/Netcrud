import { Injectable } from '@angular/core';
import { ItemsTest_changedcom } from './items-test';
@Injectable({
  providedIn: 'root'
})

export class ItemsTestService {
  getItemsMini() {
    return Promise.resolve(this.getMockItems());
  }

  private getMockItems(): ItemsTest_changedcom[] {
    return [
      {
        type: 'Notebook',
        devicename: 'Test-1m9',
        datachanged: '20/02/2025 12:22',
        approvedate: '2024-11-07 14:48:07',
      },
      {
        type: 'Notebook',
        devicename: 'NGGA-98m',
        datachanged: '15/02/2025 09:35',
        approvedate: '2024-11-10 10:12:45',
      },
      {
        type: 'Notebook',
        devicename: 'MUT-289',
        datachanged: '18/02/2025 16:50',
        approvedate: '2024-12-01 08:30:20',
      },
      {
        type: 'Desktop',
        devicename: 'OG-6809',
        datachanged: '19/02/2025 14:10',
        approvedate: '2024-12-15 11:05:33',
      },
      {
        type: 'Notebook',
        devicename: 'MY-778',
        datachanged: '17/02/2025 11:25',
        approvedate: '2024-11-25 13:40:55',
      }
    ]


  }

}
