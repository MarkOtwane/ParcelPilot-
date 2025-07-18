import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../shared/components/notification/notification.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = false;
  error = '';
  selectedUser: any = null;
  isEditing = false;
  editForm = {
    name: '',
    phone: '',
  };

  constructor(
    private userService: UserService,
    private notify: NotificationService
  ) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    this.loading = true;
    // this.error = '';

    try {
      this.users = await this.userService.getAllUsers();
    } finally {
      this.loading = false;
    }
  }

  editUser(user: any) {
    console.log('Edit clicked', user);
    this.selectedUser = user;
    this.editForm = {
      name: user.name || '',
      phone: user.phone || '',
    };
    this.isEditing = true;
  }

  async saveUser() {
    if (!this.selectedUser) return;
    console.log('Save user', this.selectedUser, this.editForm);
    try {
      await this.userService.updateUser(this.selectedUser.id, this.editForm);
      this.notify.success('User updated successfully');
      this.isEditing = false;
      this.selectedUser = null;
      await this.loadUsers(); // Reload the list
    } catch (e) {
      console.log('Save user error', e);
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedUser = null;
    this.editForm = { name: '', phone: '' };
  }

  async deleteUser(userId: string) {
    if (
      confirm(
        'Are you sure you want to delete this user? This action cannot be undone.'
      )
    ) {
      console.log('Delete clicked', userId);
      try {
        await this.userService.deleteUser(userId);
        this.notify.success('User deleted successfully');
        await this.loadUsers(); // Reload the list
      } catch (e) {
        console.log('Delete user error', e);
      }
    }
  }

  viewUserDetails(user: any) {
    this.selectedUser = user;
    this.isEditing = false;
  }

  closeModal() {
    this.selectedUser = null;
    this.isEditing = false;
    this.editForm = { name: '', phone: '' };
  }

  onBackToDashboardClick() {
    console.log('Back to Dashboard button clicked');
  }
}
