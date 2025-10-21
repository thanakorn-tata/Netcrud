import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrimeNgSharedModule } from '../../shared/prime-ng-shared.module';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PrimeNgSharedModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;

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
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // Check if redirected from registration
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['registered']) {
      this.errorMessage = '';
      // You could show a success message here if needed
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    // Simulate API delay
    setTimeout(() => {
      const success = this.authService.login(username, password);

      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
        this.loading = false;
      }
    }, 800);
  }

  // Helper function to mark all fields as touched
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
