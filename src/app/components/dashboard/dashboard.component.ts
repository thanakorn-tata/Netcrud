import { Component, OnInit } from '@angular/core';
import { PrimeNgSharedModule } from '../../shared/prime-ng-shared.module';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StudentApiService, StudentAPI } from '../../services/student-api.service';

interface TopStudent {
  rank: number;
  fullname: string;
  university: string;
  grade: string;
  department: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    PrimeNgSharedModule,
    CommonModule,
    CardModule,
    ChartModule,
    TableModule,
    FormsModule,
    TranslateModule,
    ProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loading = false;

  // Summary Stats
  totalInterns: number = 0;
  totalUniversities: number = 0;
  totalDepartments: number = 0;
  averageGrade: string = '-';

  // Top 10 Students by Grade
  topStudents: TopStudent[] = [];

  // Chart Data
  universityChartData: any;
  universityChartOptions: any;

  departmentChartData: any;
  departmentChartOptions: any;

  gradeDistributionData: any;
  gradeDistributionOptions: any;

  durationChartData: any;
  durationChartOptions: any;

  constructor(private studentApiService: StudentApiService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.studentApiService.getAll().subscribe({
      next: (students) => {
        this.calculateStats(students);
        this.calculateTopStudents(students);
        this.initUniversityChart(students);
        this.initDepartmentChart(students);
        this.initGradeDistributionChart(students);
        this.initDurationChart(students);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
      }
    });
  }

  calculateStats(students: StudentAPI[]): void {
    // Total Interns
    this.totalInterns = students.length;

    // Total Universities (unique)
    const universities = new Set(students.map(s => s.university));
    this.totalUniversities = universities.size;

    // Total Departments (unique)
    const departments = new Set(students.map(s => s.intern_department));
    this.totalDepartments = departments.size;

    // Average Grade
    const gradesWithValues = students.filter(s => s.grade);
    if (gradesWithValues.length > 0) {
      const gradeValues: { [key: string]: number } = {
        'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5,
        'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0.0
      };

      const totalGradePoints = gradesWithValues.reduce((sum, s) => {
        return sum + (gradeValues[s.grade!] || 0);
      }, 0);

      const avgGradeValue = totalGradePoints / gradesWithValues.length;

      // Convert back to grade
      if (avgGradeValue >= 3.75) this.averageGrade = 'A';
      else if (avgGradeValue >= 3.25) this.averageGrade = 'B+';
      else if (avgGradeValue >= 2.75) this.averageGrade = 'B';
      else if (avgGradeValue >= 2.25) this.averageGrade = 'C+';
      else if (avgGradeValue >= 1.75) this.averageGrade = 'C';
      else if (avgGradeValue >= 1.25) this.averageGrade = 'D+';
      else if (avgGradeValue >= 0.75) this.averageGrade = 'D';
      else this.averageGrade = 'F';
    }
  }

  calculateTopStudents(students: StudentAPI[]): void {
    // Grade order for sorting
    const gradeOrder: { [key: string]: number } = {
      'A': 1, 'B+': 2, 'B': 3, 'C+': 4,
      'C': 5, 'D+': 6, 'D': 7, 'F': 8
    };

    // Filter students with grades and sort by grade
    const studentsWithGrades = students
      .filter(s => s.grade)
      .sort((a, b) => {
        const gradeA = gradeOrder[a.grade!] || 999;
        const gradeB = gradeOrder[b.grade!] || 999;
        return gradeA - gradeB;
      })
      .slice(0, 10); // Top 10

    this.topStudents = studentsWithGrades.map((student, index) => ({
      rank: index + 1,
      fullname: student.fullname,
      university: student.university,
      grade: student.grade!,
      department: student.intern_department
    }));
  }

  initUniversityChart(students: StudentAPI[]): void {
    // Count students per university
    const universityMap = new Map<string, number>();
    students.forEach(s => {
      const uni = s.university;
      universityMap.set(uni, (universityMap.get(uni) || 0) + 1);
    });

    // Sort and get top 10
    const sortedUniversities = Array.from(universityMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    this.universityChartData = {
      labels: sortedUniversities.map(u => u[0]),
      datasets: [
        {
          label: 'จำนวนนักศึกษา',
          data: sortedUniversities.map(u => u[1]),
          backgroundColor: [
            '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#6366f1',
            '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#eef2ff'
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

  initDepartmentChart(students: StudentAPI[]): void {
    // Count students per department
    const deptMap = new Map<string, number>();
    students.forEach(s => {
      const dept = s.intern_department || 'ไม่ระบุ';
      deptMap.set(dept, (deptMap.get(dept) || 0) + 1);
    });

    const departments = Array.from(deptMap.entries());

    this.departmentChartData = {
      labels: departments.map(d => d[0]),
      datasets: [
        {
          data: departments.map(d => d[1]),
          backgroundColor: [
            '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#e0e7ff'
          ],
          borderWidth: 0,
        },
      ],
    };

    const totalCount = students.length;

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
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.parsed;
              const percentage = ((value / totalCount) * 100).toFixed(1);
              return `${context.label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
    };
  }

  initGradeDistributionChart(students: StudentAPI[]): void {
    // Count students per grade
    const gradeMap = new Map<string, number>();
    const gradeOrder = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];

    gradeOrder.forEach(g => gradeMap.set(g, 0));

    students.forEach(s => {
      if (s.grade) {
        gradeMap.set(s.grade, (gradeMap.get(s.grade) || 0) + 1);
      }
    });

    this.gradeDistributionData = {
      labels: gradeOrder,
      datasets: [
        {
          label: 'จำนวนนักศึกษา',
          data: gradeOrder.map(g => gradeMap.get(g) || 0),
          backgroundColor: '#8b5cf6',
          borderColor: '#6d28d9',
          borderWidth: 1,
        },
      ],
    };

    this.gradeDistributionOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
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

  initDurationChart(students: StudentAPI[]): void {
    // Count students per duration
    const durationMap = new Map<string, number>();
    students.forEach(s => {
      const duration = s.intern_duration || 'ไม่ระบุ';
      durationMap.set(duration, (durationMap.get(duration) || 0) + 1);
    });

    const durations = Array.from(durationMap.entries());

    this.durationChartData = {
      labels: durations.map(d => d[0]),
      datasets: [
        {
          data: durations.map(d => d[1]),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
      ],
    };

    this.durationChartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12,
            },
          },
        },
      },
    };
  }

  getGradeColor(grade: string): string {
    const colors: { [key: string]: string } = {
      'A': 'text-green-600',
      'B+': 'text-green-500',
      'B': 'text-blue-600',
      'C+': 'text-blue-500',
      'C': 'text-yellow-600',
      'D+': 'text-orange-500',
      'D': 'text-orange-600',
      'F': 'text-red-600'
    };
    return colors[grade] || 'text-gray-600';
  }

  getGradeBadgeClass(grade: string): string {
    const classes: { [key: string]: string } = {
      'A': 'bg-green-100 text-green-800',
      'B+': 'bg-green-50 text-green-700',
      'B': 'bg-blue-100 text-blue-800',
      'C+': 'bg-blue-50 text-blue-700',
      'C': 'bg-yellow-100 text-yellow-800',
      'D+': 'bg-orange-50 text-orange-700',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800'
    };
    return classes[grade] || 'bg-gray-100 text-gray-800';
  }

  refresh(): void {
    this.loadDashboardData();
  }
}
