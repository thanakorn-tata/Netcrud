import { PrimeNgSharedModule } from './../../../shared/prime-ng-shared.module';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  StudentApiService,
  StudentAPI,
} from './../../../services/test/student-api.service';
import { AuthService, User } from '../../../services/test/auth.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

interface Department {
  label: string;
  value: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-student-card-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgSharedModule,
    ProgressSpinnerModule,
    ToastModule,
  ],
  templateUrl: './student-card-view.component.html',
  styleUrls: ['./student-card-view.component.scss'],
  providers: [MessageService],
})
export class StudentCardViewComponent implements OnInit {
  // User & Role
  currentUser: User | null = null;
  isAdmin: boolean = false;
  searchTerm: string = '';

  // Data
  students: StudentAPI[] = [];
  filteredStudents: StudentAPI[] = [];
  selectedStudent: StudentAPI | null = null;

  // UI States
  loading: boolean = false;
  showDetailDialog: boolean = false;
  viewMode: 'card' | 'list' = 'card';

  // Department Filter
  selectedDepartment: string = 'all';
  departments: Department[] = [];

  // Grade Options
  gradeOptions = [
    { label: 'A', value: 'A' },
    { label: 'B+', value: 'B+' },
    { label: 'B', value: 'B' },
    { label: 'C+', value: 'C+' },
    { label: 'C', value: 'C' },
    { label: 'D+', value: 'D+' },
    { label: 'D', value: 'D' },
    { label: 'F', value: 'F' },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private studentApiService: StudentApiService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.isAdmin = this.authService.isAdmin();
    this.loadStudents();
  }

  /**
   * โหลดข้อมูลนักศึกษาทั้งหมด
   */
  loadStudents(): void {
    this.loading = true;
    this.studentApiService.getAll().subscribe({
      next: (data) => {
        this.students = data;
        this.filteredStudents = [...data];
        this.calculateDepartmentCounts();
        this.loading = false;
        console.log('✅ Loaded students:', this.students.length);
      },
      error: (err) => {
        console.error('❌ Error loading students:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'ข้อผิดพลาด',
          detail: 'ไม่สามารถโหลดข้อมูลนักศึกษาได้',
          life: 3000,
        });
        this.loading = false;
      },
    });
  }

  /**
   * คำนวณจำนวนนักศึกษาในแต่ละแผนก
   */
  calculateDepartmentCounts(): void {
    const mainDepartments = [
      'AR Soft',
      'AR DI',
      'Accounting',
      'Tester',
      'UX/UI',
      'Human Resources',
    ];

    // นับจำนวนนักศึกษาแต่ละแผนก
    const departmentMap = new Map<string, number>();
    let othersCount = 0;

    this.students.forEach((student) => {
      const dept = student.intern_department?.trim() || '';
      if (mainDepartments.includes(dept)) {
        departmentMap.set(dept, (departmentMap.get(dept) || 0) + 1);
      } else if (dept) {
        othersCount++;
      }
    });

    // สร้างรายการแผนก
    this.departments = [
      {
        label: 'ทั้งหมด',
        value: 'all',
        icon: 'pi pi-th-large',
        count: this.students.length,
      },
      {
        label: 'AR Soft',
        value: 'AR Soft',
        icon: 'pi pi-desktop',
        count: departmentMap.get('AR Soft') || 0,
      },
      {
        label: 'AR DI',
        value: 'AR DI',
        icon: 'pi pi-code',
        count: departmentMap.get('AR DI') || 0,
      },
      {
        label: 'Accounting',
        value: 'Accounting',
        icon: 'pi pi-calculator',
        count: departmentMap.get('Accounting') || 0,
      },
      {
        label: 'Tester',
        value: 'Tester',
        icon: 'pi pi-check-circle',
        count: departmentMap.get('Tester') || 0,
      },
      {
        label: 'UX/UI',
        value: 'UX/UI',
        icon: 'pi pi-palette',
        count: departmentMap.get('UX/UI') || 0,
      },
      {
        label: 'Human Resources',
        value: 'Human Resources',
        icon: 'pi pi-users',
        count: departmentMap.get('Human Resources') || 0,
      },
      {
        label: 'อื่นๆ',
        value: 'others',
        icon: 'pi pi-ellipsis-h',
        count: othersCount,
      },
    ];

    console.log('📊 Department counts:', this.departments);
  }

  /**
   * กรองนักศึกษาตามแผนก
   */
  filterByDepartment(department: string): void {
    this.selectedDepartment = department;

    if (department === 'all') {
      this.filteredStudents = [...this.students];
    } else if (department === 'others') {
      const mainDepartments = [
        'AR Soft',
        'AR DI',
        'Accounting',
        'Tester',
        'UX/UI',
        'Human Resources',
      ];
      this.filteredStudents = this.students.filter((student) => {
        const dept = student.intern_department?.trim() || '';
        return dept && !mainDepartments.includes(dept);
      });
    } else {
      this.filteredStudents = this.students.filter(
        (student) => student.intern_department?.trim() === department
      );
    }

    console.log(
      `🔍 Filtered by ${department}:`,
      this.filteredStudents.length,
      'students'
    );

    this.messageService.add({
      severity: 'info',
      summary: 'กรองข้อมูลสำเร็จ',
      detail: `แสดงนักศึกษา ${this.filteredStudents.length} คน`,
      life: 2000,
    });
  }

  /**
   * แสดง Dialog รายละเอียดนักศึกษา
   */
  viewStudentDetails(student: StudentAPI): void {
    this.selectedStudent = { ...student }; // Clone เพื่อไม่ให้กระทบ original data
    this.showDetailDialog = true;
    console.log('👁️ Viewing student:', student.fullname);
  }

  /**
   * ไปหน้าแก้ไขข้อมูลนักศึกษา
   */
  editStudent(id?: number): void {
    if (id) {
      this.showDetailDialog = false;
      this.router.navigate(['/studentmanage', id]);
      console.log('✏️ Editing student ID:', id);
    }
  }

  /**
   * ตรวจสอบว่านักศึกษาคนนี้เป็นของ user ปัจจุบันหรือไม่
   */
  isMyStudent(student: StudentAPI | null): boolean {
    if (!student) return false;
    return student.created_by === this.currentUser?.id;
  }

  /**
   * สร้าง URL สำหรับรูปโปรไฟล์
   */
  getImageUrl(profileFile: string | null | undefined): string {
    if (!profileFile) return '';

    if (profileFile.includes('profile/')) {
      return `http://localhost:8080/uploads/${profileFile}`;
    }

    return `http://localhost:8080/uploads/profile/${profileFile}`;
  }

  /**
   * ดึงชื่อไฟล์จาก path
   */
  getFileName(filePath: string | null | undefined): string {
    if (!filePath) return '';
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  }

  /**
   * กำหนดสีตามเกรด (สำหรับแสดงใน list view)
   */
  getGradeColor(grade: string | null | undefined): string {
    if (!grade) return 'text-gray-400';

    const gradeColors: { [key: string]: string } = {
      A: 'text-green-600',
      'B+': 'text-green-500',
      B: 'text-blue-600',
      'C+': 'text-blue-500',
      C: 'text-yellow-600',
      'D+': 'text-orange-500',
      D: 'text-orange-600',
      F: 'text-red-600',
    };

    return gradeColors[grade] || 'text-gray-600';
  }

  /**
   * กำหนดสีของ Badge เกรด (สำหรับแสดงในการ์ด)
   */
  getGradeBadgeClass(grade: string | null | undefined): string {
    if (!grade) return 'bg-gray-400';

    const gradeBadges: { [key: string]: string } = {
      A: 'bg-green-500',
      'B+': 'bg-green-400',
      B: 'bg-blue-500',
      'C+': 'bg-blue-400',
      C: 'bg-yellow-500',
      'D+': 'bg-orange-400',
      D: 'bg-orange-500',
      F: 'bg-red-500',
    };

    return gradeBadges[grade] || 'bg-gray-400';
  }

  /**
   * ดาวน์โหลดไฟล์โปรเจค
   */
  downloadProject(student: StudentAPI | null): void {
    if (!student || !student.project_file) {
      this.messageService.add({
        severity: 'warn',
        summary: 'คำเตือน',
        detail: 'ไม่พบไฟล์โปรเจคที่จะดาวน์โหลด',
        life: 3000,
      });
      return;
    }

    console.log('📥 Downloading project file:', student.project_file);

    const fileUrlParts = student.project_file.split('/');
    const type = fileUrlParts.length > 1 ? fileUrlParts[0] : 'project';
    const filename = fileUrlParts[fileUrlParts.length - 1];

    this.studentApiService.downloadFile(type, filename).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.messageService.add({
          severity: 'success',
          summary: 'สำเร็จ',
          detail: `ดาวน์โหลดไฟล์ ${filename} เรียบร้อยแล้ว`,
          life: 3000,
        });

        console.log('✅ Downloaded successfully:', filename);
      },
      error: (err) => {
        console.error('❌ Error downloading file:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'ข้อผิดพลาด',
          detail: 'ไม่สามารถดาวน์โหลดไฟล์ได้ กรุณาลองใหม่อีกครั้ง',
          life: 3000,
        });
      },
    });
  }

  /**
   * สลับโหมดการแสดงผล
   */
  switchViewMode(mode: 'card' | 'list'): void {
    this.viewMode = mode;
    console.log('🔄 Switched to', mode, 'view');
  }

  /**
   * อัพเดทเกรดนักศึกษา (Admin เท่านั้น)
   */
  onGradeChange(student: StudentAPI | null): void {
    if (!student) {
      console.error('❌ Student is null');
      return;
    }

    if (!this.isAdmin) {
      this.messageService.add({
        severity: 'error',
        summary: 'ไม่อนุญาต',
        detail: 'คุณไม่มีสิทธิ์แก้ไขเกรด',
        life: 3000,
      });
      return;
    }

    if (!student.id) {
      console.error('❌ Student ID is missing');
      return;
    }

    if (!student.grade) {
      console.warn('⚠️ Grade is empty');
      return;
    }

    console.log(
      `📝 Updating grade for ${student.fullname} to ${student.grade}`
    );

    this.studentApiService
      .update(student.id, { grade: student.grade })
      .subscribe({
        next: (updatedStudent) => {
          console.log('✅ Grade updated successfully:', updatedStudent);

          // อัพเดท local data
          this.students = this.students.map((s) =>
            s.id === student.id ? { ...s, grade: updatedStudent.grade } : s
          );

          this.filteredStudents = this.filteredStudents.map((s) =>
            s.id === student.id ? { ...s, grade: updatedStudent.grade } : s
          );

          // อัพเดท selectedStudent
          if (this.selectedStudent && this.selectedStudent.id === student.id) {
            this.selectedStudent.grade = updatedStudent.grade;
          }

          this.messageService.add({
            severity: 'success',
            summary: 'สำเร็จ',
            detail: `บันทึกเกรด ${updatedStudent.grade} ให้ ${student.fullname} แล้ว`,
            life: 3000,
          });
        },
        error: (err) => {
          console.error('❌ Error updating grade:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'ข้อผิดพลาด',
            detail: 'ไม่สามารถบันทึกเกรดได้ กรุณาลองใหม่อีกครั้ง',
            life: 3000,
          });

          // Reload เพื่อดึงค่าเดิมกลับมา
          this.loadStudents();
        },
      });
  }

  /**
   * ปุ่มลัดสำหรับให้เกรดแบบรวดเร็ว (สำหรับ Admin)
   */
  quickGrade(student: StudentAPI, grade: string): void {
    if (!this.isAdmin) {
      this.messageService.add({
        severity: 'error',
        summary: 'ไม่อนุญาต',
        detail: 'คุณไม่มีสิทธิ์ให้เกรด',
        life: 3000,
      });
      return;
    }

    // Clone student และ set เกรด
    const updatedStudent = { ...student, grade };
    this.onGradeChange(updatedStudent);
  }

  /**
   * กำหนด severity สำหรับปุ่มเกรด
   */
  getGradeSeverity(
    grade: string
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const severityMap: {
      [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary';
    } = {
      A: 'success',
      'B+': 'success',
      B: 'info',
      'C+': 'info',
      C: 'warn',
      'D+': 'warn',
      D: 'danger',
      F: 'danger',
    };

    return severityMap[grade] || 'secondary';
  }
  // ฟังก์ชันรวม filter และ search
  applyFilters(): void {
    // เริ่มจาก filter แผนก
    let temp = [...this.students];

    // Filter by department
    if (this.selectedDepartment && this.selectedDepartment !== 'all') {
      if (this.selectedDepartment === 'others') {
        const mainDepartments = [
          'AR Soft',
          'AR DI',
          'Accounting',
          'Tester',
          'UX/UI',
          'Human Resources',
        ];
        temp = temp.filter((student) => {
          const dept = student.intern_department?.trim() || '';
          return dept && !mainDepartments.includes(dept);
        });
      } else {
        temp = temp.filter(
          (student) =>
            student.intern_department?.trim() === this.selectedDepartment
        );
      }
    }

    // Filter by search term
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.trim().toLowerCase();
      temp = temp.filter(
        (student) =>
          student.fullname?.toLowerCase().includes(term) ||
          student.university?.toLowerCase().includes(term) ||
          student.intern_department?.toLowerCase().includes(term)
      );
    }

    this.filteredStudents = temp;
  }
}
