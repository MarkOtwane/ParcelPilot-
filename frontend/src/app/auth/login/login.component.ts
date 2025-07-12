import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/components/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isLoading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notify: NotificationService,
    private router: Router
  ) {}

  async onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;

    try {
      const { email, password } = this.form.value;
      const res = await this.authService.login(email!, password!);
      this.notify.success('Login successful!');

      const role = res.role;

      if (role === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/user/dashboard']);
      }
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Login failed');
    } finally {
      this.isLoading = false;
    }
  }
}
