import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { NotificationService } from 'src/app/shared/components/notification/notification.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  isLoading = true;
  users: any[] = [];

  constructor(
    private userService: UserService,
    private notify: NotificationService
  ) {}

  async ngOnInit() {
    try {
      this.users = await this.userService.getAllUsers();
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Failed to load users.');
    } finally {
      this.isLoading = false;
    }
  }

  async deactivateUser(id: string) {
    try {
      await this.userService.deactivateUser(id);
      this.notify.success('User deactivated');
      const user = this.users.find((u) => u.id === id);
      if (user) user.deletedAt = new Date().toISOString();
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Failed to deactivate user.');
    }
  }
}
