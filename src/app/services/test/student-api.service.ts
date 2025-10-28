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
    return this.http.get<StudentAPI[]>(this.apiUrl, {
      withCredentials: true // ✅ เพิ่ม
    });
  }

  getById(id: number): Observable<StudentAPI> {
    return this.http.get<StudentAPI>(`${this.apiUrl}/${id}`, {
      withCredentials: true // ✅ เพิ่ม
    });
  }

  create(student: StudentAPI): Observable<StudentAPI> {
    return this.http.post<StudentAPI>(this.apiUrl, student, {
      withCredentials: true // ✅ เพิ่ม
    });
  }

<<<<<<< HEAD
  update(id: number, student: Partial<StudentAPI>): Observable<StudentAPI> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, student, {
      withCredentials: true // ✅ เพิ่ม
    }).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      })
    );
=======
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
>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true // ✅ เพิ่ม
    });
  }

  createWithFiles(formData: FormData): Observable<StudentAPI> {
    return this.http.post<ApiResponse<StudentAPI>>(`${this.apiUrl}/upload`, formData, {
      withCredentials: true // ✅ เพิ่ม
    }).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return response as any;
      })
    );
  }

  updateWithFiles(id: number, formData: FormData): Observable<StudentAPI> {
    return this.http.put<ApiResponse<StudentAPI>>(`${this.apiUrl}/upload/${id}`, formData, {
      withCredentials: true // ✅ เพิ่ม (สำคัญมาก!)
    }).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return response as any;
      })
    );
  }

  // ✅ Method สำหรับดาวน์โหลดไฟล์
  downloadFile(type: string, filename: string): Observable<Blob> {
    const url = `http://localhost:8080/uploads/${type}/${filename}`;
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'body',
      withCredentials: true // ✅ เพิ่ม
    });
  }

  // ✅ Method สำหรับตรวจสอบสิทธิ์การแก้ไข
  canEdit(id: number): Observable<{canEdit: boolean, reason?: string}> {
    return this.http.get<{canEdit: boolean, reason?: string}>(`${this.apiUrl}/${id}/can-edit`, {
      withCredentials: true // ✅ เพิ่ม
    });
  }
}
