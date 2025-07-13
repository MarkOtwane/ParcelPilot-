import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';

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

  constructor(private userService: UserService) {}

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
    } finally {
      this.loading = false;
    }
  }
}
