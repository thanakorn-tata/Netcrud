import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface RegisterRequest {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role?: string;
}

// เพิ่ม interface สำหรับ response
interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  role?: string;
  fullname?: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  role?: string;
  fullname?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem(this.USER_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // ==================== REGISTER ====================
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData, { withCredentials: true }).pipe(
      map(response => {
        if (response.success && response.user) {
          console.log('Register success', response.user);
          return response;
        }
        throw new Error(response.message || 'Registration failed');
      }),
      catchError(this.handleError)
    );
  }

  // ==================== LOGIN ====================
  login(username: string, password: string): Observable<any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }, { withCredentials: true }).pipe(
      map(response => {
        if (response.success) {
          // สร้าง User object จาก response
          const user: User = {
            id: 0, // Backend ไม่ได้ส่ง id มา อาจต้องเรียก /me เพื่อดึงข้อมูลเต็ม
            username: username,
            fullname: response.fullname || '',
            email: '', // Backend ไม่ได้ส่ง email มา
            role: response.role as 'ADMIN' | 'USER'
          };

          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);

          return response;
        }
        throw new Error(response.message || 'Login failed');
      }),
      catchError(this.handleError)
    );
  }

  // ==================== LOGOUT ====================
  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
      },
      error: () => {
        // ลบ local data แม้ logout ไม่สำเร็จ
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
      }
    });
  }

  // ==================== LOAD CURRENT USER ====================
  loadCurrentUser(): Observable<User> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      map(response => {
        if (response.success && response.user) {
          this.currentUserSubject.next(response.user);
          return response.user;
        }
        throw new Error(response.message || 'Failed to load user');
      }),
      catchError(err => {
        this.currentUserSubject.next(null);
        return throwError(() => err);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'ADMIN';
  }

  isUser(): boolean {
    return this.currentUserValue?.role === 'USER';
  }

  getRole(): string | null {
    return this.currentUserValue?.role || null;
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'เกิดข้อผิดพลาด';

    if (error.error?.message) {
      message = error.error.message;
    } else if (error.status === 0) {
      message = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
    } else if (error.status === 401) {
      message = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    } else if (error.status === 500) {
      message = 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์';
    }

    console.error('API Error:', error);
    return throwError(() => new Error(message));
  }
}
