import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/shared/components/notification/notification.service';

@Component({
  selector: 'app-reset-update',
  templateUrl: './reset-update.component.html',
  styleUrls: ['./reset-update.component.scss'],
})
export class ResetUpdateComponent implements OnInit {
  isLoading = false;
  token: string | null = null;

  form = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private notify: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.notify.error('Reset token not found in URL.');
      this.router.navigate(['/login']);
    }
  }

  async onSubmit() {
    if (this.form.invalid || !this.token) return;

    this.isLoading = true;

    try {
      await this.auth.resetPassword(this.token, this.form.value.newPassword!);
      this.notify.success('Password reset successful! You can now login.');
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Password reset failed.');
    } finally {
      this.isLoading = false;
    }
  }
}
