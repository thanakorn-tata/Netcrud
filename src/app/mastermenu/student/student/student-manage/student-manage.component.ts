import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNgSharedModule } from '../../../../shared/prime-ng-shared.module';

@Component({
  selector: 'app-student-manage',
  templateUrl: './student-manage.component.html',
  styleUrls: ['./student-manage.component.scss'],
  imports: [PrimeNgSharedModule,]
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
    attached_project: ''
  };
profilePreview: string | ArrayBuffer | null = null;
projectFileName: string = '';

onProfileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => this.profilePreview = reader.result;
    reader.readAsDataURL(file);
  }
}

onProjectChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.projectFileName = file.name;
  }
}
  constructor(
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    // ตรวจสอบว่า route มี id หรือไม่
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.studentId = +id;
        // TODO: เรียก API เพื่อดึงข้อมูลนักศึกษาโดย id
      } else {
        this.isEditMode = false;
      }
    });
  }

  onSave() {
    if (this.isEditMode) {
      // TODO: call API update student
      console.log('Update student', this.studentId, this.student);
    } else {
      // TODO: call API add student
      console.log('Add student', this.student);
    }
    this.router.navigate(['/student-manage']);
  }

  onCancel() {
    this.router.navigate(['/mastermenu/student']);
  }
}
