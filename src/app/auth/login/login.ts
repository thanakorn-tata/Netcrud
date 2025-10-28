import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/test/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // ตรวจสอบว่า login แล้วหรือยัง
    const user = this.authService.currentUserValue;
    if (user) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    console.log('🔐 Attempting login...');

    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('✅ Login successful:', response);

        // ✅ FIX: เรียก loadCurrentUser เพื่อดึง user.id ที่ถูกต้องจาก Backend
        this.authService.loadCurrentUser().subscribe({
          next: (user) => {
            console.log('✅ User loaded with ID:', user.id);
            this.loading = false;
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('❌ Failed to load user details:', err);
            // ถึงแม้ loadUser ไม่สำเร็จ ก็ยังให้เข้าระบบได้
            this.loading = false;
            this.router.navigate(['/dashboard']);
          }
        });
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        this.errorMessage = err.message || 'เข้าสู่ระบบไม่สำเร็จ';
        this.loading = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
