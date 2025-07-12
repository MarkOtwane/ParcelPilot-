import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/components/notification/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  isLoading = false;

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private notify: NotificationService,
    private router: Router
  ) {}

  async onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;

    try {
      const { name, email, phone, password } = this.form.value;
      const res = await this.auth.register({ name, email, phone, password });

      this.notify.success('Account created! Redirecting...');

      const role = res.role;
      if (role === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/user/dashboard']);
      }
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Registration failed.');
    } finally {
      this.isLoading = false;
    }
  }
}
