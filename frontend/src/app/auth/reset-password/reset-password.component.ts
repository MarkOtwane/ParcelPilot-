import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit() {
    if (this.resetForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      try {
        await this.authService.requestResetPassword(this.resetForm.value.email);
        this.success = 'Password reset link has been sent to your email.';
      } catch (error: any) {
        this.error =
          error.error?.message ||
          'Failed to send reset link. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }
}
