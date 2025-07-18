import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'parcels',
    loadComponent: () =>
      import('./parcels/parcels.component').then((m) => m.ParcelsComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'payments',
    loadComponent: () =>
      import('./payments/payments.component').then((m) => m.PaymentsComponent),
  },
  {
    path: 'metrics',
    loadComponent: () =>
      import('./metrics/metrics.component').then((m) => m.MetricsComponent),
  },
  {
    path: 'support',
    loadComponent: () =>
      import('./support/support.component').then((m) => m.SupportComponent),
  },
  {
    path: 'create-parcel',
    loadComponent: () => import('./create-parcel/create-parcel.component').then(m => m.CreateParcelComponent),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
