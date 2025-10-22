import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
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

  1. ข้อมูลเก็บที่ไหน?
    - เก็บใน Memory (sessionStorage)
    - ข้อมูลจะหายเมื่อปิด browser
    - เหมาะสำหรับการทดสอบเท่านั้น

  2. การใช้งานจริง:
    - ควรเชื่อมต่อกับ Backend API
    - เก็บข้อมูลใน Database (MySQL, MongoDB, PostgreSQL)
    - ต้อง hash password ด้วย bcrypt
    - ใช้ JWT Token สำหรับ authentication

  3. ข้อมูล Demo:
    - admin / admin123
    - test / test123

  4. วิธีดูข้อมูล:
    - เปิด Browser Console (F12)
    - พิมพ์: sessionStorage.getItem('student_system_users')
    - จะเห็นข้อมูลผู้ใช้ทั้งหมด

  5. การ Reset:
    - sessionStorage.clear() // ลบข้อมูลทั้งหมด
  */
