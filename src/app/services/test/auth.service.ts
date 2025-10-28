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
  user?: User; // ✅ เพิ่ม user field (กรณี Backend ส่งมาครบ)
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
          console.log('✅ Register success', response.user);
          return response;
        }
        throw new Error(response.message || 'Registration failed');
      }),
      catchError(this.handleError)
    );
  }

  // ==================== LOGIN ====================
  login(username: string, password: string): Observable<any> {
    console.log('🔐 Sending login request...');

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { username, password },
      { withCredentials: true }
    ).pipe(
      map(response => {
        console.log('📡 Login response:', response);

        if (response.success) {
          // ✅ ถ้า Backend ส่ง user object ครบมา ใช้เลย
          if (response.user) {
            console.log('✅ Backend sent full user object');
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
            return response;
          }

          // ⚠️ ถ้า Backend ไม่ส่ง user ครบ สร้าง temporary user
          // (จะต้องเรียก loadCurrentUser() ตามด้วย)
          console.warn('⚠️ Backend did not send full user object, creating temporary user');
          const tempUser: User = {
            id: 0, // ⚠️ Temporary ID - must call loadCurrentUser() after
            username: username,
            fullname: response.fullname || '',
            email: '',
            role: response.role as 'ADMIN' | 'USER'
          };

          localStorage.setItem(this.USER_KEY, JSON.stringify(tempUser));
          this.currentUserSubject.next(tempUser);

          return response;
        }

        throw new Error(response.message || 'Login failed');
      }),
      catchError(this.handleError)
    );
  }

  // ==================== LOGOUT ====================
  logout(): Observable<void> {
  return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
    tap(() => {
      console.log('✅ Logout successful');
      localStorage.removeItem(this.USER_KEY);
      this.currentUserSubject.next(null);
    }),
    catchError(err => {
      console.error('❌ Logout error:', err);
      localStorage.removeItem(this.USER_KEY);
      this.currentUserSubject.next(null);
      return throwError(() => err);
    }),
    map(() => void 0)
  );
}


  // ==================== LOAD CURRENT USER ====================
  loadCurrentUser(): Observable<User> {
    console.log('🔍 Loading current user from /me endpoint...');

    return this.http.get<AuthResponse>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      map(response => {
        console.log('📡 /me response:', response);

        if (response.success && response.user) {
          console.log('✅ User loaded successfully:', response.user);

          // ✅ บันทึก user ที่ได้ทับของเดิม
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);

          return response.user;
        }

        throw new Error(response.message || 'Failed to load user');
      }),
      catchError(err => {
        console.error('❌ Failed to load current user:', err);

        // ⚠️ ถ้าดึง user ไม่สำเร็จ ลบ session
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);

        return throwError(() => err);
      })
    );
  }

  // ==================== UTILITY METHODS ====================
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

  getUserId(): number | null {
    return this.currentUserValue?.id || null;
  }

  // ==================== ERROR HANDLER ====================
  private handleError(error: HttpErrorResponse) {
    let message = 'เกิดข้อผิดพลาด';

    console.error('🔴 HTTP Error:', {
      status: error.status,
      statusText: error.statusText,
      error: error.error,
      message: error.message
    });

    if (error.error?.message) {
      message = error.error.message;
    } else if (error.status === 0) {
      message = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
    } else if (error.status === 401) {
      message = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    } else if (error.status === 400) {
      message = 'ข้อมูลไม่ถูกต้อง';
    } else if (error.status === 500) {
      message = 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง';
    }

    return throwError(() => new Error(message));
  }
}
