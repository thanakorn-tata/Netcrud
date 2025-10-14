// student-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface University {
  rank: number;
  name: string;
  students: number;
  trend: string;
}

interface QuarterData {
  quarter: string;
  students: number;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    TableModule,
    Select,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // Summary Stats
  totalInterns: number = 278;
  totalUniversities: number = 10;
  activeInterns: number = 95;
  averagePerQuarter: number = 100;

  // Year Selection
  years: any[] = [
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
  ];
  selectedYear: string = '2024';

  // Top 10 Universities Data
  universities: University[] = [
    { rank: 1, name: 'Chulalongkorn University', students: 45, trend: '↑' },
    { rank: 2, name: 'Thammasat University', students: 38, trend: '↑' },
    { rank: 3, name: 'Mahidol University', students: 35, trend: '→' },
    { rank: 4, name: 'Kasetsart University', students: 32, trend: '↑' },
    { rank: 5, name: "King Mongkut's University", students: 28, trend: '↓' },
    { rank: 6, name: 'Chiang Mai University', students: 25, trend: '↑' },
    { rank: 7, name: 'Prince of Songkla University', students: 22, trend: '→' },
    { rank: 8, name: 'Khon Kaen University', students: 20, trend: '↑' },
    { rank: 9, name: 'Burapha University', students: 18, trend: '→' },
    { rank: 10, name: 'Silpakorn University', students: 15, trend: '↑' },
  ];

  // Chart Data
  universityChartData: any;
  universityChartOptions: any;

  quarterlyChartData: any;
  quarterlyChartOptions: any;

  departmentChartData: any;
  departmentChartOptions: any;

  ngOnInit() {
    this.initUniversityChart();
    this.initQuarterlyChart();
    this.initDepartmentChart();
  }

  initUniversityChart() {
    this.universityChartData = {
      labels: this.universities.map((u) => u.name),
      datasets: [
        {
          label: 'Number of Students',
          data: this.universities.map((u) => u.students),
          backgroundColor: [
            '#8b5cf6',
            '#a78bfa',
            '#c4b5fd',
            '#ddd6fe',
            '#6366f1',
            '#818cf8',
            '#a5b4fc',
            '#c7d2fe',
            '#e0e7ff',
            '#eef2ff',
          ],
          borderRadius: 8,
        },
      ],
    };

    this.universityChartOptions = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          color: '#000000',
          anchor: 'end',
          align: 'end',
          formatter: (value: number) => value,
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: '#e5e7eb',
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      },
    };
  }

  initQuarterlyChart() {
    this.quarterlyChartData = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Total Students',
          data: [85, 102, 118, 95],
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointBackgroundColor: '#8b5cf6',
        },
        {
          label: 'New Interns',
          data: [42, 55, 68, 45],
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointBackgroundColor: '#06b6d4',
        },
        {
          label: 'Completed',
          data: [38, 48, 52, 58],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointBackgroundColor: '#10b981',
        },
      ],
    };

    this.quarterlyChartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12,
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#e5e7eb',
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    };
  }

  initDepartmentChart() {
    const totalCount = 378;

    this.departmentChartData = {
      labels: ['Engineering', 'Business', 'IT', 'Design', 'Others'],
      datasets: [
        {
          data: [120, 85, 95, 45, 33],
          backgroundColor: [
            '#8b5cf6',
            '#a78bfa',
            '#c4b5fd',
            '#ddd6fe',
            '#e0e7ff',
          ],
          borderWidth: 0,
        },
      ],
    };

    this.departmentChartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 15,
            font: {
              size: 12,
            },
          },
        },
        datalabels: {
          color: '#000000',
          formatter: (value: number) => {
            const percentage = ((value / totalCount) * 100).toFixed(1);
            return `${percentage}%`;
          },
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
    };
  }

  getTrendClass(trend: string): string {
    if (trend === '↑') return 'text-green-600';
    if (trend === '↓') return 'text-red-600';
    return 'text-gray-600';
  }
}
