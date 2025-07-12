import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RolesGuard } from './core/guards/roles.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'user',
    canActivate: [AuthGuard, RolesGuard],
    data: { roles: ['USER'] },
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },

  {
    path: 'admin',
    canActivate: [AuthGuard, RolesGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  { path: '**', redirectTo: '/not-found' },
  {
    path: 'user',
    canActivate: [AuthGuard, RolesGuard],
    data: { roles: ['USER'] },
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RolesGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
