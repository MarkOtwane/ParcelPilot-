import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../shared/components/notification/notification.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = false;
  error = '';

  constructor(
    private userService: UserService,
    private notify: NotificationService
  ) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    this.loading = true;
    this.error = '';
    
    try {
      this.users = await this.userService.getAllUsers();
    } catch (error: any) {
      this.error = error.error?.message || 'Failed to load users.';
      this.notify.error(this.error);
    } finally {
      this.loading = false;
    }
  }

  editUser(user: any) {
    // TODO: Implement edit user functionality
    this.notify.info('Edit user functionality coming soon');
  }

  async deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        // TODO: Implement delete user functionality
        this.notify.info('Delete user functionality coming soon');
      } catch (error: any) {
        this.notify.error(error.error?.message || 'Failed to delete user');
      }
    }
  }
}
