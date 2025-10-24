import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: User;
}

export interface RegisterRequest {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
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

  // ----------------- REGISTER -----------------
  register(userData: RegisterRequest): Observable<any> {
    // ถ้าไม่มี backend ใช้ mock response
    const mockResponse = {
      success: true,
      message: 'User registered successfully'
    };
    return of(mockResponse).pipe(
      map(res => {
        console.log('✅ สมัครสมาชิกสำเร็จ:', res);
        return res;
      }),
      catchError(err => throwError(() => err))
    );

    // ถ้ามี backend จริง uncomment ด้านล่าง
    /*
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      map(res => {
        console.log('✅ สมัครสมาชิกสำเร็จ:', res);
        return res;
      }),
      catchError(err => throwError(() => err))
    );
    */
  }

  // ----------------- LOGIN -----------------
  login(username: string, password: string): Observable<LoginResponse> {
    // Mock users
    const mockUsers: User[] = [
      { id: 1, username: 'admin', fullname: 'Admin User', email: 'admin@example.com', role: 'ADMIN' },
      { id: 2, username: 'student', fullname: 'Student User', email: 'student@example.com', role: 'USER' }
    ];

    const user = mockUsers.find(u => u.username === username && password === '123456');

    if (user) {
      const mockResponse: LoginResponse = {
        success: true,
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        user
      };
      // เก็บ token และ user
      localStorage.setItem(this.TOKEN_KEY, mockResponse.token!);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, mockResponse.refreshToken!);
      localStorage.setItem(this.USER_KEY, JSON.stringify(mockResponse.user));
      this.currentUserSubject.next(user);

      console.log('✅ เข้าสู่ระบบสำเร็จ:', user);
      return of(mockResponse);
    } else {
      return of({ success: false });
    }

    // ถ้ามี backend จริง uncomment ด้านล่าง
    /*
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      map(res => {
        if (res.success && res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken!);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
        return res;
      }),
      catchError(err => throwError(() => err))
    );
    */
  }

  // ----------------- LOGOUT -----------------
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    console.log('👋 ออกจากระบบแล้ว');
  }

  // ----------------- HELPERS -----------------
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserValue;
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'ADMIN';
  }

  isUser(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'USER';
  }

  getRole(): string | null {
    return this.currentUserValue?.role || null;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return true;
    }
  }

  validateToken(): Observable<any> {
    // ถ้าไม่มี backend ใช้ mock
    if (this.isLoggedIn()) return of({ valid: true });
    return of({ valid: false });

    // ถ้ามี backend จริง uncomment
    // return this.http.get(`${this.apiUrl}/validate`).pipe(
    //   catchError(err => {
    //     this.logout();
    //     return throwError(() => err);
    //   })
    // );
  }
}
