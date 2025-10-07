import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-software-assets',
  imports: [CardModule, ButtonModule, TranslateModule, ChartModule, CommonModule],
  templateUrl: './software-assets.component.html',
  styleUrl: './software-assets.component.scss'
})
export class SoftwareAssetsComponent implements OnInit {
  data: any;
  options: any;
  totalCount: number = 0;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.translateService.get(['dashboard.lcchart.proprietary', 'dashboard.lcchart.shareware', 'dashboard.lcchart.demo', 'dashboard.lcchart.windowlc', 'dashboard.lcchart.freeware', 'dashboard.lcchart.freesoftware', 'dashboard.lcchart.opensource','dashboard.lcchart.commercial']).subscribe(translations => {
      const assetCounts = [90, 10, 90, 69, 190, 10000, 67, 0];  
      this.totalCount = assetCounts.reduce((sum, count) => sum + count, 0);  

      this.data = {
        labels: [
          translations['dashboard.lcchart.proprietary'],
          translations['dashboard.lcchart.shareware'],
          translations['dashboard.lcchart.demo'],
          translations['dashboard.lcchart.windowlc'],
          translations['dashboard.lcchart.freeware'],
          translations['dashboard.lcchart.freesoftware'],
          translations['dashboard.lcchart.opensource'],
          translations['dashboard.lcchart.commercial'],
        ],
        datasets: [
          {
            data: assetCounts,
            backgroundColor: [
              '#c18bd6 ',
              '#E4A9E6',
              '#937fe3',
              '#9a80b0',
              '#dab6f2',
              '#b0a3e0',
              '#f4c2d7',
              '#cbbfd1',
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
          position:'right'
        },

        datalabels: {
          color: '#000000',
          formatter: (value: number, ctx: any) => {
            const percentage = (value / this.totalCount) * 100;
            
            if (percentage < 5) {
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
