import { Injectable } from '@angular/core';
<<<<<<< HEAD
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
=======
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f
  fullname: string;
  username: string;
  email: string;
  password: string;
<<<<<<< HEAD
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
=======
  role: 'admin' | 'user'; // เพิ่ม role
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USERS_KEY = 'student_system_users';
  private readonly CURRENT_USER_KEY = 'student_system_current_user';

  // BehaviorSubject สำหรับเก็บข้อมูล current user
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor() {
    // โหลดข้อมูล user จาก sessionStorage
    const storedUser = sessionStorage.getItem(this.CURRENT_USER_KEY);
    this.currentUserSubject = new BehaviorSubject<any>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();

    // สร้างข้อมูล demo user ครั้งแรก
    this.initializeDemoUsers();
  }

  // Getter สำหรับดึงค่า current user
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // สร้าง demo users สำหรับทดสอบ
  private initializeDemoUsers(): void {
    const users = this.getUsers();
    if (users.length === 0) {
      const demoUsers: User[] = [
        {
          id: '1',
          fullname: 'ผู้ดูแลระบบ',
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date(),
        },
        {
          id: '2',
          fullname: 'ผู้ใช้ทั่วไป',
          username: 'test',
          email: 'test@example.com',
          password: 'test123',
          role: 'user',
          createdAt: new Date(),
        },
      ];
      this.saveUsers(demoUsers);
    }
  }

  // ดึงข้อมูลผู้ใช้ทั้งหมดจาก Memory (จำลองการเก็บข้อมูล)
  private getUsers(): User[] {
    // ในการใช้งานจริง ควรเชื่อมต่อกับ Backend API
    // ที่นี่เราจำลองด้วยการเก็บใน Memory

    // หมายเหตุ: ข้อมูลจะหายเมื่อ refresh หน้าเว็บ
    // ถ้าต้องการเก็บถาวร ต้องใช้ Backend Database

    const usersJson = sessionStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  // บันทึกข้อมูลผู้ใช้
  private saveUsers(users: User[]): void {
    sessionStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // สมัครสมาชิก
  register(userData: any): boolean {
    const users = this.getUsers();

    // ตรวจสอบว่า username ซ้ำหรือไม่
    const existingUser = users.find((u) => u.username === userData.username);
    if (existingUser) {
      return false;
    }

    // สร้าง user ใหม่
    const newUser: User = {
      id: Date.now().toString(),
      fullname: userData.fullname,
      username: userData.username,
      email: userData.email,
      password: userData.password, // ในการใช้งานจริงต้อง hash password
      role: 'user', // user ทั่วไปจะเป็น role 'user'
      createdAt: new Date(),
    };

    users.push(newUser);
    this.saveUsers(users);

    console.log('✅ สมัครสมาชิกสำเร็จ:', newUser);
    console.log('📊 ผู้ใช้ทั้งหมดในระบบ:', users.length, 'คน');

    return true;
  }

  // เข้าสู่ระบบ
  login(username: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // เก็บข้อมูล user ที่ login (ไม่เก็บ password)
      const { password, ...userWithoutPassword } = user;
      sessionStorage.setItem(
        this.CURRENT_USER_KEY,
        JSON.stringify(userWithoutPassword)
      );

      // อัพเดท BehaviorSubject
      this.currentUserSubject.next(userWithoutPassword);

      console.log('✅ เข้าสู่ระบบสำเร็จ:', userWithoutPassword);
      return true;
    }

    console.log('❌ เข้าสู่ระบบไม่สำเร็จ');
    return false;
  }

  // ออกจากระบบ
  logout(): void {
    sessionStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
    console.log('👋 ออกจากระบบแล้ว');
  }

  // ตรวจสอบว่า login อยู่หรือไม่
  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.CURRENT_USER_KEY) !== null;
  }

  // ดึงข้อมูล user ที่ login อยู่
  getCurrentUser(): any {
    const userJson = sessionStorage.getItem(this.CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  // ตรวจสอบว่าเป็น Admin หรือไม่
  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user && user.role === 'admin';
  }

  // ตรวจสอบว่าเป็น User ทั่วไปหรือไม่
  isUser(): boolean {
    const user = this.currentUserValue;
    return user && user.role === 'user';
  }

  // ดึง role ของ user ที่ login อยู่
  getRole(): string | null {
    const user = this.currentUserValue;
    return user ? user.role : null;
  }

  // ดูข้อมูลผู้ใช้ทั้งหมด (สำหรับ admin)
  getAllUsers(): User[] {
    return this.getUsers().map(({ password, ...user }) => user as any);
  }

  // ลบข้อมูลทั้งหมด (สำหรับ reset ระบบ)
  clearAllData(): void {
    sessionStorage.removeItem(this.USERS_KEY);
    sessionStorage.removeItem(this.CURRENT_USER_KEY);
    console.log('🗑️ ลบข้อมูลทั้งหมดแล้ว');
  }
}

/*
  📝 คำอธิบาย:
>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f


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
