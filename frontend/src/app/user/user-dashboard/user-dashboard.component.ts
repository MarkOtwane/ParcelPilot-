import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

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
    private router: Router
  ) {
    const token = this.authService.getToken();
    if (token) {
      this.user = this.authService.decodeJwt(token);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
