import { Injectable } from '@angular/core';
import { ItemTest_empty } from './items-test';
@Injectable({
  providedIn: 'root',
})
export class ItemsTestService2 {
  getItemsMini() {
    return Promise.resolve(this.getMockItems());
  }

  private getMockItems(): ItemTest_empty[] {
    return [];
  }
}
