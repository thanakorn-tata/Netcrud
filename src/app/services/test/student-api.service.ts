import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudentAPI {
  id?: number;
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
  created_by?: number | null;
  profile_file?: string | null;
  project_file?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class StudentApiService {
  private apiUrl = 'http://localhost:8080/api/student';

  constructor(private http: HttpClient) {}

  getAll(): Observable<StudentAPI[]> {
    return this.http.get<StudentAPI[]>(this.apiUrl);
  }

  getById(id: number): Observable<StudentAPI> {
    return this.http.get<StudentAPI>(`${this.apiUrl}/${id}`);
  }

  create(student: StudentAPI): Observable<StudentAPI> {
    return this.http.post<StudentAPI>(this.apiUrl, student);
  }

  // สำหรับการสร้างพร้อมไฟล์
  createWithFiles(formData: FormData): Observable<StudentAPI> {
    return this.http.post<StudentAPI>(this.apiUrl, formData);
  }

  update(id: number, student: StudentAPI): Observable<StudentAPI> {
    return this.http.put<StudentAPI>(`${this.apiUrl}/${id}`, student);
  }

  // สำหรับการอัปเดตพร้อมไฟล์
  updateWithFiles(id: number, formData: FormData): Observable<StudentAPI> {
    return this.http.put<StudentAPI>(`${this.apiUrl}/${id}`, formData);
  }

  // สำหรับการอัปเดตเฉพาะเกรด
  updateGrade(id: number, grade: string): Observable<StudentAPI> {
    return this.http.patch<StudentAPI>(`${this.apiUrl}/${id}/grade`, {
      grade: grade,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
