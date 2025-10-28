import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgSharedModule } from '../../shared/prime-ng-shared.module';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { AuthService, RegisterRequest } from '../../services/test/auth.service';

interface RegisterFormValue {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule, // เพิ่มตรงนี้
    PrimeNgSharedModule,
    MessagesModule,
    MessageModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  messages: any[] = [];

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
    this.registerForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) return null;
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.loading = true;
    this.messages = [];

    const formValue = this.registerForm.value as RegisterFormValue;
    const payload: RegisterRequest = {
      fullname: formValue.fullname,
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      role: 'USER' // เพิ่ม default role
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        // response มี success, message, user
        console.log('Register successful:', response);
        this.messages = [{
          severity: 'success',
          summary: 'สำเร็จ',
          detail: 'สมัครสมาชิกสำเร็จ! กำลังไปหน้าเข้าสู่ระบบ...'
        }];
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        // err เป็น Error object ที่มี message
        console.error('Register error:', err);
        this.messages = [{
          severity: 'error',
          summary: 'เกิดข้อผิดพลาด',
          detail: err.message || 'สมัครสมาชิกไม่สำเร็จ'
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
