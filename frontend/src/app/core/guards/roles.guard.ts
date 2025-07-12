import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RolesGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.auth.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = this.auth.decodeJwt(token);
    const requiredRoles = route.data['roles'] as string[];

    if (!requiredRoles.includes(user.role)) {
      this.router.navigate(['/not-authorized']);
      return false;
    }

    return true;
  }
}
