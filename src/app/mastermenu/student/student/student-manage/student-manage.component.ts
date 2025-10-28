import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNgSharedModule } from '../../../../shared/prime-ng-shared.module';
import { StudentApiService, StudentAPI } from '../../../../services/test/student-api.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../../../services/test/auth.service'; // เพิ่มบรรทัดนี้

@Component({
  selector: 'app-student-manage',
  standalone: true, // เพิ่มถ้าเป็น standalone
  templateUrl: './student-manage.component.html',
  styleUrls: ['./student-manage.component.scss'],
  imports: [PrimeNgSharedModule, ProgressSpinnerModule],
  providers: [MessageService]
})
export class StudentmanageComponent implements OnInit {
  studentId?: number;
  isEditMode = false;
  loading = false;

  student = {
    fullname: '',
    university: '',
    faculty: '',
    major: '',
    contact_number: '',
    email: '',
    intern_department: '',
    intern_duration: '',
    attached_project: '',
  };

  profilePreview: string | ArrayBuffer | null = null;
  projectFileName: string = '';
  existingProjectFileUrl: string = '';

  profileFile: File | null = null;
  projectFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentApiService: StudentApiService,
    private messageService: MessageService,
    private authService: AuthService // เพิ่มบรรทัดนี้
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.studentId = +id;
        this.loadStudent(this.studentId);
      } else {
        this.isEditMode = false;
      }
    });
  }

  loadStudent(id: number) {
  this.loading = true;
  this.studentApiService.getById(id).subscribe({
    next: (student) => {
      this.student = {
        fullname: student.fullname,
        university: student.university,
        faculty: student.faculty,
        major: student.major,
        contact_number: student.contact_number,
        email: student.email,
        intern_department: student.intern_department,
        intern_duration: student.intern_duration,
        attached_project: student.attached_project || ''
      };

      if (student.profile_file) {
        this.profilePreview = `http://localhost:8080/uploads/${student.profile_file}`;
      }

      if (student.project_file) {
        this.projectFileName = student.project_file.split('/').pop() || '';
        this.existingProjectFileUrl = `http://localhost:8080/uploads/${student.project_file}`;
      }

      this.loading = false;
    },
    error: (err) => {
      console.error('Error loading student:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'ข้อผิดพลาด',
        detail: err.message || 'ไม่สามารถโหลดข้อมูลนักศึกษาได้'
      });
      this.loading = false;
    }
  });
}

  onProfileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // ตรวจสอบประเภทไฟล์
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.messageService.add({
          severity: 'error',
          summary: 'ข้อผิดพลาด',
          detail: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, GIF)'
        });
        return;
      }

      // ตรวจสอบขนาดไฟล์ (เช่น ไม่เกิน 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.messageService.add({
          severity: 'error',
          summary: 'ข้อผิดพลาด',
          detail: 'ไฟล์รูปภาพมีขนาดใหญ่เกินไป (สูงสุด 5MB)'
        });
        return;
      }

      this.profileFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onProjectChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // ตรวจสอบประเภทไฟล์
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip',
        'application/x-zip-compressed'
      ];

      if (!allowedTypes.includes(file.type)) {
        this.messageService.add({
          severity: 'error',
          summary: 'ข้อผิดพลาด',
          detail: 'กรุณาเลือกไฟล์ PDF, DOC, DOCX หรือ ZIP เท่านั้น'
        });
        return;
      }

      // ตรวจสอบขนาดไฟล์ (เช่น ไม่เกิน 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.messageService.add({
          severity: 'error',
          summary: 'ข้อผิดพลาด',
          detail: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)'
        });
        return;
      }

      this.projectFile = file;
      this.projectFileName = file.name;
      this.student.attached_project = file.name;
      this.existingProjectFileUrl = '';
    }
  }

  downloadProjectFile() {
    if (this.existingProjectFileUrl) {
      window.open(this.existingProjectFileUrl, '_blank');
    } else if (this.projectFile) {
      const url = URL.createObjectURL(this.projectFile);
      window.open(url, '_blank');
      // ล้าง URL หลังใช้งานเพื่อประหยัด memory
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'คำเตือน',
        detail: 'ไม่พบไฟล์โปรเจกต์'
      });
    }
  }

  onSave() {
    // Validate required fields
    if (!this.student.fullname || !this.student.university ||
        !this.student.faculty || !this.student.major ||
        !this.student.contact_number || !this.student.email) {
      this.messageService.add({
        severity: 'error',
        summary: 'ข้อผิดพลาด',
        detail: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน'
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.student.email)) {
      this.messageService.add({
        severity: 'error',
        summary: 'ข้อผิดพลาด',
        detail: 'รูปแบบอีเมลไม่ถูกต้อง'
      });
      return;
    }

    this.loading = true;

    const formData = new FormData();

    // ดึง User ID จาก AuthService
    const currentUser = this.authService.currentUserValue;
    const createdBy = currentUser?.id || 1;

    const studentData: StudentAPI = {
      fullname: this.student.fullname.trim(),
      university: this.student.university.trim(),
      faculty: this.student.faculty.trim(),
      major: this.student.major.trim(),
      contact_number: this.student.contact_number.trim(),
      email: this.student.email.trim().toLowerCase(),
      intern_department: this.student.intern_department?.trim() || '',
      intern_duration: this.student.intern_duration?.trim() || '',
      attached_project: this.student.attached_project || null,
      grade: null,
      created_by: createdBy
    };

    formData.append('student', JSON.stringify(studentData));

    if (this.profileFile) {
      formData.append('profileFile', this.profileFile);
    }

    if (this.projectFile) {
      formData.append('projectFile', this.projectFile);
    }

    if (this.isEditMode && this.studentId) {
      this.updateStudent(formData);
    } else {
      this.createStudent(formData);
    }
  }

  private createStudent(formData: FormData) {
    this.studentApiService.createWithFiles(formData).subscribe({
      next: (response) => {
        console.log('Student created successfully:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'สำเร็จ',
          detail: 'เพิ่มข้อมูลนักศึกษาเรียบร้อยแล้ว'
        });
        this.loading = false;
        setTimeout(() => this.router.navigate(['/student']), 1500);
      },
      error: (err) => {
        console.error('Error creating student:', err);
        const errorMessage = err.error?.message || err.message || 'ไม่สามารถเพิ่มข้อมูลได้';
        this.messageService.add({
          severity: 'error',
          summary: 'ข้อผิดพลาด',
          detail: errorMessage
        });
        this.loading = false;
      }
    });
  }

  private updateStudent(formData: FormData) {
    this.studentApiService.updateWithFiles(this.studentId!, formData).subscribe({
      next: (response) => {
        console.log('Student updated successfully:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'สำเร็จ',
          detail: 'แก้ไขข้อมูลนักศึกษาเรียบร้อยแล้ว'
        });
        this.loading = false;
        setTimeout(() => this.router.navigate(['/student']), 1500);
      },
      error: (err) => {
        console.error('Error updating student:', err);
        const errorMessage = err.error?.message || err.message || 'ไม่สามารถแก้ไขข้อมูลได้';
        this.messageService.add({
          severity: 'error',
          summary: 'ข้อผิดพลาด',
          detail: errorMessage
        });
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/student']);
  }
}
