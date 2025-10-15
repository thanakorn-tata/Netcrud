import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNgSharedModule } from '../../../../shared/prime-ng-shared.module';
import { StudentService } from '../../../../services/test/student.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-student-manage',
  templateUrl: './student-manage.component.html',
  styleUrls: ['./student-manage.component.scss'],
  imports: [PrimeNgSharedModule],
  providers: [MessageService]
})
export class StudentmanageComponent implements OnInit {
  studentId?: number;
  isEditMode = false;

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
    description: ''
  };

  profilePreview: string | ArrayBuffer | null = null;
  projectFileName: string = '';

  // Dropdown options
  departments = [
    { name: 'ฝ่ายพัฒนาแอปพลิเคชัน' },
    { name: 'ฝ่ายทดสอบระบบ' },
    { name: 'ฝ่ายวิเคราะห์ระบบ' }
  ];

  durations = [
    { name: 'มกราคม - มีนาคม 2568' },
    { name: 'เมษายน - มิถุนายน 2568' },
    { name: 'กรกฎาคม - กันยายน 2568' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private messageService: MessageService
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
    const foundStudent = this.studentService.getStudentById(id);
    if (foundStudent) {
      this.student = {
        fullname: foundStudent.fullname,
        university: foundStudent.university,
        faculty: foundStudent.faculty,
        major: foundStudent.major,
        contact_number: foundStudent.contact_number,
        email: foundStudent.email,
        intern_department: foundStudent.intern_department,
        intern_duration: foundStudent.intern_duration,
        attached_project: foundStudent.attached_project || '',
        description: foundStudent.description || ''
      };
      this.profilePreview = foundStudent.profileImage || null;
    }
  }

  onProfileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
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
      this.projectFileName = file.name;
      this.student.attached_project = file.name;
    }
  }

  onSave() {
    // Validate required fields
    if (!this.student.fullname || !this.student.university ||
        !this.student.faculty || !this.student.major ||
        !this.student.contact_number || !this.student.email) {

      this.messageService.add({
        severity: 'error',
        summary: 'ข้อผิดพลาด', // สามารถใช้ JSON i18n แทนได้
        detail: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน'
      });
      return; // stop function ถ้า validation ไม่ผ่าน
    }

    if (this.isEditMode && this.studentId) {
      // Update existing student
      this.studentService.updateStudent(this.studentId, {
        ...this.student,
        profileImage: this.profilePreview as string
      });

      this.messageService.add({
        severity: 'success',
        summary: 'สำเร็จ',
        detail: 'แก้ไขข้อมูลนักศึกษาเรียบร้อยแล้ว'
      });
    } else {
      // Add new student
      this.studentService.addStudent({
        ...this.student,
        profileImage: this.profilePreview as string
      });

      this.messageService.add({
        severity: 'success',
        summary: 'สำเร็จ',
        detail: 'เพิ่มข้อมูลนักศึกษาเรียบร้อยแล้ว'
      });
    }

    this.router.navigate(['/student']);
  }

  onCancel() {
    this.router.navigate(['/student']);
  }
}
