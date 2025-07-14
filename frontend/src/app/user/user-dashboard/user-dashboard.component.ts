import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class UserDashboardComponent {
  user: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.loadUser();
  }

  async loadUser() {
    try {
      this.user = await this.userService.getMyProfile();
    } catch {
      this.user = { name: 'User' };
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
