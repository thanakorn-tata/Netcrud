import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Student {
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
  attached_project?: string;
  description?: string;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private studentsSubject = new BehaviorSubject<Student[]>([
    {
      id: 1,
      rowNum: 1,
      fullname: 'นายสมชาย ใจดี',
      university: 'มหาวิทยาลัยศรีนครินทรวิโรฒ',
      faculty: 'คณะบริหารธุรกิจ',
      major: 'สาขาวิชาคอมพิวเตอร์ธุรกิจ',
      contact_number: '0812345678',
      email: 'somchai@example.com',
      intern_department: 'ฝ่ายพัฒนาแอปพลิเคชัน',
      intern_duration: 'มกราคม - มีนาคม 2568',
      attached_project: 'ระบบจัดการข้อมูลนักศึกษา',
    },
  ]);

  students$ = this.studentsSubject.asObservable();

  constructor() {}

  // Get all students
  getStudents(): Student[] {
    return this.studentsSubject.value;
  }

  // Get student by ID
  getStudentById(id: number): Student | undefined {
    return this.studentsSubject.value.find((s) => s.id === id);
  }

  // Add new student
  addStudent(student: Omit<Student, 'id' | 'rowNum'>): void {
    const currentStudents = this.studentsSubject.value;
    const newId =
      currentStudents.length > 0
        ? Math.max(...currentStudents.map((s) => s.id)) + 1
        : 1;

    const newStudent: Student = {
      ...student,
      id: newId,
      rowNum: currentStudents.length + 1,
    };

    this.studentsSubject.next([...currentStudents, newStudent]);
  }

  // Update existing student
  updateStudent(id: number, updatedData: Partial<Student>): void {
    const currentStudents = this.studentsSubject.value;
    const index = currentStudents.findIndex((s) => s.id === id);

    if (index !== -1) {
      currentStudents[index] = { ...currentStudents[index], ...updatedData };
      this.studentsSubject.next([...currentStudents]);
    }
  }

  // Delete student
  deleteStudent(id: number): void {
    const currentStudents = this.studentsSubject.value;
    const filtered = currentStudents.filter((s) => s.id !== id);

    // Re-calculate rowNum
    const reindexed = filtered.map((s, idx) => ({
      ...s,
      rowNum: idx + 1,
    }));

    this.studentsSubject.next(reindexed);
  }
}
