import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/shared/components/notification/notification.service';

@Component({
  selector: 'app-reset-request',
  templateUrl: './reset-request.component.html',
  styleUrls: ['./reset-request.component.scss'],
})
export class ResetRequestComponent {
  isLoading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notify: NotificationService
  ) {}

  async onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;

    try {
      await this.authService.requestResetPassword(this.form.value.email!);
      this.notify.success('Reset link sent to your email.');
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Reset request failed.');
    } finally {
      this.isLoading = false;
    }
  }
}
