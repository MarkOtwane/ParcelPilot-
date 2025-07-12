import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.auth.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const decoded = this.auth.decodeJwt(token);
    const expired = decoded?.exp * 1000 < Date.now();

    if (expired) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
