import { Injectable } from '@angular/core';
import { ItemTest_expiring } from './items-test';
@Injectable({
  providedIn: 'root',
})
export class ItemsTestExpiring {
  getItemsMini() {
    return Promise.resolve(this.getMockItems());
  }

  private getMockItems(): ItemTest_expiring[] {
    return [
      {
        software: 'Visual Studio Code',
        version: '1.75.1',
        licence: 'MIT',
        buydate: '2024-01-15',
        expiration: '2025-01-15',
      },
      {
        software: 'IntelliJ IDEA',
        version: '2023.2',
        licence: 'Apache 2.0',
        buydate: '2023-06-20',
        expiration: '2024-06-20',
      },
      {
        software: 'Adobe Photoshop',
        version: '24.0.1',
        licence: 'Subscription',
        buydate: '2023-08-10',
        expiration: '2024-08-10',
      },
      {
        software: 'Microsoft Office 365',
        version: '2023',
        licence: 'Commercial',
        buydate: '2023-11-05',
        expiration: '2024-11-05',
      },
      {
        software: 'JetBrains PyCharm',
        version: '2023.3',
        licence: 'Personal License',
        buydate: '2023-12-01',
        expiration: '2024-12-01',
      },
    ];
  }
}
