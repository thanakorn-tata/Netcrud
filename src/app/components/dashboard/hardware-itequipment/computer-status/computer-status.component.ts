import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-computer-status',
  imports: [TranslateModule, ChartModule, CommonModule],
  templateUrl: './computer-status.component.html',
  styleUrl: './computer-status.component.scss'
})
export class ComputerStatusComponent implements OnInit {
  data: any;
  options: any;
  totalCount: number = 0;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.translateService.get(['dashboard.computerstatus.onlinenormal', 'dashboard.computerstatus.onlinechanged', 'dashboard.computerstatus.offlinenormal', 'dashboard.computerstatus.offlinechanged']).subscribe(translations => {
      const assetCounts = [0, 4, 36, 50]; 
      this.totalCount = assetCounts.reduce((sum, count) => sum + count, 0); 

      this.data = {
        labels: [
          translations['dashboard.computerstatus.onlinenormal'],
          translations['dashboard.computerstatus.onlinechanged'],
          translations['dashboard.computerstatus.offlinenormal'],
          translations['dashboard.computerstatus.offlinechanged']
        ],
        datasets: [
          {
            data: assetCounts,
            backgroundColor: [
              '#c18bd6',
              '#E4A9E6',
              '#937fe3',
              '#9a80b0'
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
            size: 12
          },
          display: true
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }
}
