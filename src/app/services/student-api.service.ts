import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  created_by?: number;
}

@Injectable({
  providedIn: 'root'
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

  update(id: number, student: StudentAPI): Observable<StudentAPI> {
    return this.http.put<StudentAPI>(`${this.apiUrl}/${id}`, student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
