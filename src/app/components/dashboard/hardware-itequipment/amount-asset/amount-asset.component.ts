import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({
  selector: 'app-amount-asset',
  imports: [CommonModule, ChartModule, ButtonModule, CardModule, TranslateModule],
  templateUrl: './amount-asset.component.html',
  styleUrl: './amount-asset.component.scss'
})
export class AmountAssetComponent {
  assets = [
    { name: 'dashboard.amount.desktop', count: 7, icon: 'pi pi-desktop' },
    { name: 'dashboard.amount.notebook', count: 29, icon: 'pi pi-desktop' }
  ];
  
  totalCount = this.assets.reduce((sum, asset) => sum + asset.count, 0);
  
  chartData = {
    datasets: [{
      data: this.assets.map(asset => asset.count),
      backgroundColor: ['#E4A9E6', '#c18bd6'],
      borderWidth: 0
    }],
    labels: ['Desktop', 'Notebook']
  };

  chartOptions = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        color: '#000000',
        formatter: (value: number) => {
          const percentage = ((value / this.totalCount) * 100).toFixed(1);
          return value !== 0 ? `${percentage}%` : '';
        },
        font: {
          size: 14
        },
        display: true
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };
}