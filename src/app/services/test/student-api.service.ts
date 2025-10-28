import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  created_at?: string;
  updated_at?: string;
}

// เพิ่ม interface สำหรับ response
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
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

  // ✅ แก้ไข update method
  update(id: number, student: Partial<StudentAPI>): Observable<StudentAPI> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, student).pipe(
      map(response => {
        // ถ้า backend return { success: true, data: {...} }
        if (response && response.data) {
          return response.data;
        }
        // ถ้า backend return object ตรงๆ
        return response;
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ✅ แก้ไข createWithFiles
  createWithFiles(formData: FormData): Observable<StudentAPI> {
    return this.http.post<ApiResponse<StudentAPI>>(`${this.apiUrl}/upload`, formData).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return response as any;
      })
    );
  }

  // ✅ แก้ไข updateWithFiles
  updateWithFiles(id: number, formData: FormData): Observable<StudentAPI> {
    return this.http.put<ApiResponse<StudentAPI>>(`${this.apiUrl}/upload/${id}`, formData).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return response as any;
      })
    );
  }
}
