import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { PrimeNgSharedModule } from "../../../../shared/prime-ng-shared.module";
import { GlobalService } from '../../../../services/test/global.service';
import { StudentmanageComponent } from '../student-manage/student-manage.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  imports: [PrimeNgSharedModule]
})
export class StudentComponent {

  // Data
  students = [
    {
      id: 1,
      rowNum: 1,
      fullname: "นายสมชาย ใจดี",
      university: "มหาวิทยาลัยศรีนครินทรวิโรฒ",
      faculty: "คณะบริหารธุรกิจ",
      major: "สาขาวิชาคอมพิวเตอร์ธุรกิจ",
      contact_number: "0812345678",
      email: "somchai@example.com",
      intern_department: "ฝ่ายพัฒนาแอปพลิเคชัน",
      intern_duration: "มกราคม - มีนาคม 2568",
      attached_project: "ระบบจัดการข้อมูลนักศึกษา"
    }
  ];

  totalRecords = this.students.length;
  rows = 10;

  constructor(
    private router: Router,
    private globalService: GlobalService) {}

  // Paginator / Table event
  onSearch(event: any) {
    console.log("Page change:", event);
    // TODO: implement search logic (API call / filtering)
  }

  // Navigate to Add / Edit page
openPage() {
  // Navigate ไปหน้า Student Manage
  this.router.navigate(['/studentmanage']);
}




  onClear() {
    console.log("Clear form / search");
  }

  deleteStudent(id: number) {
    console.log("Delete student with ID:", id);
  }
}
