import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../shared/components/notification/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  isLoading = false;
  isPasswordUpdating = false;

  profileForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notify: NotificationService
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    try {
      const user = await this.userService.getMyProfile();
      this.profileForm.patchValue({
        name: user.name,
        phone: user.phone,
      });
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Failed to load profile.');
    } finally {
      this.isLoading = false;
    }
  }

  async updateProfile() {
    if (this.profileForm.invalid) return;

    try {
      await this.userService.updateProfile(this.profileForm.value);
      this.notify.success('Profile updated!');
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Profile update failed.');
    }
  }

  async changePassword() {
    if (this.passwordForm.invalid) return;

    this.isPasswordUpdating = true;
    try {
      await this.userService.changePassword(this.passwordForm.value);
      this.notify.success('Password changed!');
      this.passwordForm.reset();
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Password change failed.');
    } finally {
      this.isPasswordUpdating = false;
    }
  }
}
