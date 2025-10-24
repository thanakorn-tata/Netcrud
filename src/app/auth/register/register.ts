import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgSharedModule } from '../../shared/prime-ng-shared.module';
import { AuthService } from '../../services/test/auth.service';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimeNgSharedModule, MessagesModule, MessageModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  messages: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      fullname: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.loading = true;
    this.messages = [];

    const { confirmPassword, ...userData } = this.registerForm.value;

    // เรียก API Backend
    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Register response:', response);

        if (response.success) {
          // สมัครสมาชิกสำเร็จ
          this.messages = [{
            severity: 'success',
            summary: 'สำเร็จ',
            detail: 'สมัครสมาชิกสำเร็จ! กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...'
          }];

          // รอ 2 วินาทีแล้ว redirect ไปหน้า login
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.messages = [{
            severity: 'error',
            summary: 'เกิดข้อผิดพลาด',
            detail: response.message || 'สมัครสมาชิกไม่สำเร็จ'
          }];
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Register error:', error);

        // แสดง error message จาก Backend
        let errorDetail = 'เกิดข้อผิดพลาดในการสมัครสมาชิก';

        if (error.error?.message) {
          errorDetail = error.error.message;
        } else if (error.status === 0) {
          errorDetail = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
        }

        this.messages = [{
          severity: 'error',
          summary: 'เกิดข้อผิดพลาด',
          detail: errorDetail
        }];

        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
