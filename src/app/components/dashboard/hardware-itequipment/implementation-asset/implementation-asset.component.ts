import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-implementation-asset',
  imports: [CardModule, ButtonModule, TranslateModule, ChartModule, CommonModule],
  templateUrl: './implementation-asset.component.html',
  styleUrl: './implementation-asset.component.scss'
})
export class ImplementationAssetComponent implements OnInit {
  data: any;
  options: any;
  totalCount: number = 0;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.translateService.get(['dashboard.implementation.assetchart.active', 'dashboard.implementation.assetchart.ready', 'dashboard.implementation.assetchart.suspend', 'dashboard.implementation.assetchart.deprecated']).subscribe(translations => {
      const assetCounts = [90, 10, 0, 0];  
      this.totalCount = assetCounts.reduce((sum, count) => sum + count, 0);  

      this.data = {
        labels: [
          translations['dashboard.implementation.assetchart.active'],
          translations['dashboard.implementation.assetchart.ready'],
          translations['dashboard.implementation.assetchart.suspend'],
          translations['dashboard.implementation.assetchart.deprecated']
        ],
        datasets: [
          {
            data: assetCounts,
            backgroundColor: [
              '#c18bd6',
              '#937fe3',
              '#d0cae6',
              '#d0cae6'
            ]
          }
        ]
      };
    });

    this.options = {
      plugins: {
        legend: {
          labels: {
            color: '#000000', 
            font: {
              size: 14, 
            }
          },
          position: 'right'
        },

        datalabels: {
          color: '#000000',
          formatter: (value: number) => {
            const percentage = (value / this.totalCount) * 100;

            if (percentage < 3) {
              return '';  
            }

            return value !== 0 ? `${percentage.toFixed(1)}%` : '';
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
}
