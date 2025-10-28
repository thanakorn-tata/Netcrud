import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNgSharedModule } from '../../../../shared/prime-ng-shared.module';
import {
  StudentApiService,
  StudentAPI,
} from '../../../../services/test/student-api.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
<<<<<<< HEAD
import { AuthService } from '../../../../services/test/auth.service';
=======
>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f

@Component({
  selector: 'app-student-manage',
  standalone: true,
  templateUrl: './student-manage.component.html',
  styleUrls: ['./student-manage.component.scss'],
  imports: [PrimeNgSharedModule, ProgressSpinnerModule],
  providers: [MessageService],
})
export class StudentmanageComponent implements OnInit {
  studentId?: number;
  isEditMode = false;
  loading = false;
  canEdit = true;
  isViewOnly = false;

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
<<<<<<< HEAD
=======
    description: '',
>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
<<<<<<< HEAD
    // 🔍 Debug: แสดงข้อมูล User ปัจจุบัน
    const currentUser = this.authService.currentUserValue;
    console.log('🔍 Current User:', currentUser);
    console.log('🔍 User Role:', currentUser?.role);
    console.log('🔍 User ID:', currentUser?.id);

    // ✅ ถ้า user.id = 0 แสดงว่ายังไม่ได้เรียก loadCurrentUser()
    if (currentUser && currentUser.id === 0) {
      console.warn('⚠️ User ID is 0, loading full user data...');
      this.authService.loadCurrentUser().subscribe({
        next: (user) => {
          console.log('✅ User data reloaded:', user);
        },
        error: (err) => {
          console.error('❌ Failed to reload user:', err);
        }
      });
    }

    this.route.paramMap.subscribe(params => {
=======
    this.route.paramMap.subscribe((params) => {
>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.studentId = +id;
        this.loadStudent(this.studentId);
        this.checkEditPermission(this.studentId);
      } else {
        this.isEditMode = false;
        this.canEdit = true;
        this.isViewOnly = false;
      }
    });
  }

  /**
   * ✅ ตรวจสอบสิทธิ์การแก้ไข
   * - ADMIN = แก้ไขได้เสมอ
   * - USER = ต้องเรียก API ตรวจสอบ
   */
  checkEditPermission(studentId: number): void {
    const currentUser = this.authService.currentUserValue;

    // ⚠️ ถ้ายังไม่มี user หรือ user.id = 0 ให้รอสักครู่
    if (!currentUser || currentUser.id === 0) {
      console.warn('⚠️ User not fully loaded, waiting...');
      setTimeout(() => this.checkEditPermission(studentId), 500);
      return;
    }

    // ✅ ถ้าเป็น ADMIN ให้แก้ไขได้เลย
    if (currentUser.role === 'ADMIN') {
      this.canEdit = true;
      this.isViewOnly = false;
      console.log('✅ Admin user - full access granted');
      return;
    }

    // ✅ ถ้าไม่ใช่ Admin ให้เรียก API ตรวจสอบ
    console.log('🔍 Checking edit permission for student ID:', studentId);

    this.studentApiService.canEdit(studentId).subscribe({
      next: (response) => {
        console.log('📡 API Response:', response);
        this.canEdit = response.canEdit;
        this.isViewOnly = !response.canEdit;

        if (this.isViewOnly) {
          this.messageService.add({
            severity: 'info',
            summary: 'โหมดดูข้อมูล',
            detail: response.reason || 'คุณสามารถดูข้อมูลได้เท่านั้น ไม่สามารถแก้ไขได้',
            life: 5000
          });
        }

        console.log('✅ Permission Check Result:', {
          canEdit: this.canEdit,
          isViewOnly: this.isViewOnly
        });
      },
      error: (err) => {
        console.error('❌ Error checking permission:', err);

        // ✅ ถ้า error 401 แสดงว่าไม่มี session
        if (err.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'ไม่มีสิทธิ์เข้าถึง',
            detail: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
            life: 5000
          });

          // Redirect ไป login
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }, 2000);
          return;
        }

        // ✅ Error อื่น ๆ ให้เป็น view-only
        this.canEdit = false;
        this.isViewOnly = true;

        this.messageService.add({
          severity: 'warn',
          summary: 'ไม่สามารถตรวจสอบสิทธิ์',
          detail: 'คุณสามารถดูข้อมูลได้เท่านั้น',
          life: 5000
        });
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
<<<<<<< HEAD
          attached_project: student.attached_project || ''
=======
          attached_project: student.attached_project || '',
          description: '',
>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f
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
<<<<<<< HEAD
          detail: err.message || 'ไม่สามารถโหลดข้อมูลนักศึกษาได้'
=======
          detail: 'ไม่สามารถโหลดข้อมูลนักศึกษาได้',
>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f
        });
        this.loading = false;
      },
    });
  }

  downloadProjectFile() {
    if (!this.existingProjectFileUrl) {
      this.messageService.add({
        severity: 'warn',
        summary: 'คำเตือน',
        detail: 'ไม่พบไฟล์โปรเจกต์'
      });
      return;
    }

    const fileUrlParts = this.existingProjectFileUrl.split('/');
    const type = fileUrlParts[fileUrlParts.length - 2];
    const filename = fileUrlParts[fileUrlParts.length - 1];

    this.studentApiService.downloadFile(type, filename).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.projectFileName || filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading file:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'ข้อผิดพลาด',
          detail: 'ไม่สามารถดาวน์โหลดไฟล์ได้'
        });
      }
    });
  }

  onProfileChange(event: any) {
    if (this.isViewOnly) {
      this.messageService.add({
        severity: 'warn',
        summary: 'ไม่อนุญาต',
        detail: 'คุณไม่มีสิทธิ์แก้ไขข้อมูลนี้'
      });
      event.target.value = '';
      return;
    }

    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.messageService.add({
          severity: 'error',
          summary: 'ข้อผิดพลาด',
          detail: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, GIF)'
        });
        event.target.value = '';
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.messageService.add({
          severity: 'error',
          summary: 'ข้อผิดพลาด',
          detail: 'ไฟล์รูปภาพมีขนาดใหญ่เกินไป (สูงสุด 5MB)'
        });
        event.target.value = '';
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
    if (this.isViewOnly) {
      this.messageService.add({
        severity: 'warn',
        summary: 'ไม่อนุญาต',
        detail: 'คุณไม่มีสิทธิ์แก้ไขข้อมูลนี้'
      });
      event.target.value = '';
      return;
    }

    const file = event.target.files[0];
    if (file) {
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
        event.target.value = '';
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        this.messageService.add({
          severity: 'error',
          summary: 'ข้อผิดพลาด',
          detail: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)'
        });
        event.target.value = '';
        return;
      }

      this.projectFile = file;
      this.projectFileName = file.name;
      this.student.attached_project = file.name;
      this.existingProjectFileUrl = '';
    }
  }

<<<<<<< HEAD
  onSave() {
    if (this.isViewOnly) {
      this.messageService.add({
        severity: 'error',
        summary: 'ไม่อนุญาต',
        detail: 'คุณไม่มีสิทธิ์แก้ไขข้อมูลนี้'
=======
  downloadProjectFile() {
    if (this.existingProjectFileUrl) {
      window.open(this.existingProjectFileUrl, '_blank');
    } else if (this.projectFile) {
      // ถ้าเพิ่งอัปโหลดไฟล์ใหม่ แต่ยังไม่ save สามารถเปิด preview หรือดาวน์โหลดไฟล์ชั่วคราวได้ (optional)
      const url = URL.createObjectURL(this.projectFile);
      window.open(url, '_blank');
    }
  }

  onSave() {
    // Validate required fields
    if (
      !this.student.fullname ||
      !this.student.university ||
      !this.student.faculty ||
      !this.student.major ||
      !this.student.contact_number ||
      !this.student.email
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'ข้อผิดพลาด',
        detail: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน',
>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f
      });
      return;
    }

<<<<<<< HEAD
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
    const currentUser = this.authService.currentUserValue;

    // ✅ ใช้ user.id ที่ถูกต้อง
    const createdBy = currentUser?.id || 0;

    console.log('💾 Saving with user ID:', createdBy);

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
=======
    this.loading = true;

    const formData = new FormData();

    const studentData: StudentAPI = {
      fullname: this.student.fullname,
      university: this.student.university,
      faculty: this.student.faculty,
      major: this.student.major,
      contact_number: this.student.contact_number,
      email: this.student.email,
      intern_department: this.student.intern_department,
      intern_duration: this.student.intern_duration,
      attached_project: this.student.attached_project || null,
      grade: null,
      created_by: 1, // TODO: ใช้ User ID จาก AuthService
>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f
    };

    formData.append('student', JSON.stringify(studentData));

<<<<<<< HEAD
    if (this.profileFile) formData.append('profileFile', this.profileFile);
    if (this.projectFile) formData.append('projectFile', this.projectFile);

    if (this.isEditMode && this.studentId) {
      this.updateStudent(formData);
    } else {
      this.createStudent(formData);
    }
  }

  private createStudent(formData: FormData) {
    this.studentApiService.createWithFiles(formData).subscribe({
      next: () => {
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

        // ✅ ถ้า error 401 แสดงว่า session หมดอายุ
        if (err.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'ไม่มีสิทธิ์เข้าถึง',
            detail: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง'
          });
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'ข้อผิดพลาด',
            detail: err.message || 'ไม่สามารถเพิ่มข้อมูลได้'
          });
        }
        this.loading = false;
      }
    });
  }

  private updateStudent(formData: FormData) {
    this.studentApiService.updateWithFiles(this.studentId!, formData).subscribe({
      next: () => {
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

        // ✅ ถ้า error 401 แสดงว่า session หมดอายุ
        if (err.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'ไม่มีสิทธิ์เข้าถึง',
            detail: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง'
          });
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          const errorMessage = err.error?.message || err.message || 'ไม่สามารถแก้ไขข้อมูลได้';
          this.messageService.add({
            severity: 'error',
            summary: 'ข้อผิดพลาด',
            detail: errorMessage
          });
        }
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/student']);
  }
=======
    if (this.profileFile) {
      formData.append('profileFile', this.profileFile);
    }

    if (this.projectFile) {
      formData.append('projectFile', this.projectFile);
    }

    if (this.isEditMode && this.studentId) {
      // ✅ Update existing student
      this.studentApiService
        .updateWithFiles(this.studentId, formData)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'สำเร็จ',
              detail: 'แก้ไขข้อมูลนักศึกษาเรียบร้อยแล้ว',
            });
            this.loading = false;
            setTimeout(() => this.router.navigate(['/student']), 1000);
          },
          error: (err) => {
            console.error('Error updating student:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'ข้อผิดพลาด',
              detail: 'ไม่สามารถแก้ไขข้อมูลได้',
            });
            this.loading = false;
          },
        });
    } else {
      // ✅ Create new student
      this.studentApiService.createWithFiles(formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'สำเร็จ',
            detail: 'เพิ่มข้อมูลนักศึกษาเรียบร้อยแล้ว',
          });
          this.loading = false;
          setTimeout(() => this.router.navigate(['/student']), 1000);
        },
        error: (err) => {
          console.error('Error creating student:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'ข้อผิดพลาด',
            detail: 'ไม่สามารถเพิ่มข้อมูลได้',
          });
          this.loading = false;
        },
      });
    }
  }

  onCancel() {
    this.router.navigate(['/student']);
  }
>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f
}
