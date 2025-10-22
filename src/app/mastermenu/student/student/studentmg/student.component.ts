import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgSharedModule } from "../../../../shared/prime-ng-shared.module";
import { StudentApiService, StudentAPI } from '../../../../services/test/student-api.service';
import { AuthService, User } from '../../../../services/test/auth.service';
interface Student {
  id: number;
  rowNum: number;
  fullname: string;
  university: string;
  faculty: string;
  major: string;
  contact_number: string;
  email: string;
  intern_department: string;
  intern_duration: string;
  attached_project?: string | null;
  grade?: string | null;
  // allow null because API may return null
  created_by?: number | null;
}

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNgSharedModule],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  // User & Role
  currentUser: User | null = null;
  isAdmin: boolean = false;

  // Loading State
  loading: boolean = false;

  // Grade Options
  gradeOptions = [
    { label: 'A', value: 'A' },
    { label: 'B+', value: 'B+' },
    { label: 'B', value: 'B' },
    { label: 'C+', value: 'C+' },
    { label: 'C', value: 'C' },
    { label: 'D+', value: 'D+' },
    { label: 'D', value: 'D' },
    { label: 'F', value: 'F' }
  ];

  // Search Filters
  searchFilters = {
    fullname: '',
    university: '',
    faculty: '',
    major: '',
    contact_number: '',
    email: ''
  };

  // Data
  students: Student[] = [];
  filteredStudents: Student[] = [];
  totalRecords = 0;
  rows = 10;

  // Delete Dialog
  showDeleteDialog = false;
  selectedStudent: Student | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private studentApiService: StudentApiService,
    ) {}

  ngOnInit(): void {
    // Get current user & role
    this.currentUser = this.authService.currentUserValue;
    this.isAdmin = this.authService.isAdmin();

    // Load students from API
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentApiService.getAll().subscribe({
      next: (data) => {
        // สร้าง Student objects แบบชัดเจน (ไม่ใช้ spread ของ API object)
        this.students = data.map((apiStudent, index): Student => ({
          id: apiStudent.id ?? 0,
          rowNum: index + 1,
          fullname: apiStudent.fullname ?? '',
          university: apiStudent.university ?? '',
          faculty: apiStudent.faculty ?? '',
          major: apiStudent.major ?? '',
          contact_number: apiStudent.contact_number ?? '',
          email: apiStudent.email ?? '',
          intern_department: apiStudent.intern_department ?? '',
          intern_duration: apiStudent.intern_duration ?? '',
          attached_project: apiStudent.attached_project ?? null,
          grade: apiStudent.grade ?? null,
          created_by: apiStudent.created_by ?? null
        }));

        // Filter students based on role
        if (this.isAdmin) {
          this.filteredStudents = [...this.students];
        } else {
          this.filteredStudents = [...this.students];
        }

        this.totalRecords = this.filteredStudents.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.loading = false;
      }
    });
  }


  onSearch(): void {
    this.filteredStudents = this.students.filter(student => {
      return (
        (!this.searchFilters.fullname ||
          student.fullname.toLowerCase().includes(this.searchFilters.fullname.toLowerCase())) &&
        (!this.searchFilters.university ||
          student.university.toLowerCase().includes(this.searchFilters.university.toLowerCase())) &&
        (!this.searchFilters.faculty ||
          student.faculty.toLowerCase().includes(this.searchFilters.faculty.toLowerCase())) &&
        (!this.searchFilters.major ||
          student.major.toLowerCase().includes(this.searchFilters.major.toLowerCase()))
      );
    });
    this.totalRecords = this.filteredStudents.length;
  }

  onClear(): void {
    this.searchFilters = {
      fullname: '',
      university: '',
      faculty: '',
      major: '',
      contact_number: '',
      email: ''
    };
    this.filteredStudents = [...this.students];
    this.totalRecords = this.filteredStudents.length;
  }

  // เช็คว่าเป็นข้อมูลของ User ที่ Login อยู่หรือไม่
  isMyStudent(student: Student): boolean {
    return student.created_by === this.currentUser?.id;
  }

  onGradeChange(student: Student): void {
    if (!student.id) return;

    this.loading = true;

    // Update grade via API
    const updateData: StudentAPI = {
      fullname: student.fullname,
      university: student.university,
      faculty: student.faculty,
      major: student.major,
      contact_number: student.contact_number,
      email: student.email,
      intern_department: student.intern_department,
      intern_duration: student.intern_duration,
      attached_project: student.attached_project ?? null,
      grade: student.grade ?? null,
      // ensure API gets number | null
      created_by: student.created_by ?? null
    };

    this.studentApiService.update(student.id, updateData).subscribe({
      next: (updatedStudent) => {
        console.log(`Updated grade for ${student.fullname}: ${student.grade}`);
        this.loading = false;

        // Update local data
        const index = this.students.findIndex(s => s.id === student.id);
        if (index !== -1) {
          this.students[index].grade = updatedStudent.grade;
        }
      },
      error: (err) => {
        console.error('Error updating grade:', err);
        this.loading = false;
        alert('เกิดข้อผิดพลาดในการอัพเดทเกรด');
      }
    });
  }

  getGradeColor(grade: string | undefined | null): string {
    if (!grade) return 'text-gray-400';

    const gradeColors: { [key: string]: string } = {
      'A': 'text-green-600',
      'B+': 'text-green-500',
      'B': 'text-blue-600',
      'C+': 'text-blue-500',
      'C': 'text-yellow-600',
      'D+': 'text-orange-500',
      'D': 'text-orange-600',
      'F': 'text-red-600'
    };

    return gradeColors[grade] || 'text-gray-600';
  }

  openPage(id?: number): void {
    if (id) {
      this.router.navigate(['/studentmanage', id]);
    } else {
      this.router.navigate(['/studentmanage']);
    }
  }

  viewStudent(id: number): void {
    this.router.navigate(['/studentmanage', id], {
      queryParams: { readonly: true }
    });
  }

  deleteStudent(id: number): void {
    const student = this.students.find(s => s.id === id);

    // เช็คว่า User สามารถลบได้หรือไม่
    if (!this.isAdmin && student?.created_by !== this.currentUser?.id) {
      alert('คุณไม่สามารถลบข้อมูลของผู้อื่นได้');
      return;
    }

    this.selectedStudent = student || null;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.selectedStudent && this.selectedStudent.id) {
      this.loading = true;

      this.studentApiService.delete(this.selectedStudent.id).subscribe({
        next: () => {
          console.log(`Deleted student: ${this.selectedStudent!.fullname}`);

          // Remove from local data
          this.students = this.students.filter(s => s.id !== this.selectedStudent!.id);
          this.onSearch(); // Refresh filtered list

          this.loading = false;
          this.showDeleteDialog = false;
          this.selectedStudent = null;
        },
        error: (err) => {
          console.error('Error deleting student:', err);
          this.loading = false;
          alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
      });
    }
  }
}
