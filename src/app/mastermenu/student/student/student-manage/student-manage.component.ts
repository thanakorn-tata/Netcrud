import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNgSharedModule } from '../../../../shared/prime-ng-shared.module';
import {
  StudentApiService,
  StudentAPI,
} from '../../../../services/test/student-api.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-student-manage',
  templateUrl: './student-manage.component.html',
  styleUrls: ['./student-manage.component.scss'],
  imports: [PrimeNgSharedModule, ProgressSpinnerModule],
  providers: [MessageService],
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
    description: '',
  };

  profilePreview: string | ArrayBuffer | null = null;
  projectFileName: string = '';

  // 🔥 เพิ่ม: เก็บ URL ของไฟล์ project ที่มีอยู่แล้ว
  existingProjectFileUrl: string = '';

  // เก็บไฟล์จริง
  profileFile: File | null = null;
  projectFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentApiService: StudentApiService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
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
          attached_project: student.attached_project || '',
          description: '',
        };

        // แสดง preview ของรูปถ้ามี
        if (student.profile_file) {
          this.profilePreview = `http://localhost:8080/uploads/${student.profile_file}`;
        }

        // 🔥 แก้ไข: แสดงชื่อไฟล์โปรเจกต์และเก็บ URL สำหรับดาวน์โหลด
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
          detail: 'ไม่สามารถโหลดข้อมูลนักศึกษาได้',
        });
        this.loading = false;
      },
    });
  }

  onProfileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
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
      this.projectFile = file;
      this.projectFileName = file.name;
      this.student.attached_project = file.name;
      // ถ้ามีไฟล์ใหม่ ให้ล้าง URL เดิมเพราะจะอัปโหลดไฟล์ใหม่
      this.existingProjectFileUrl = '';
    }
  }

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
      });
      return;
    }

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
    };

    formData.append('student', JSON.stringify(studentData));

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
}
