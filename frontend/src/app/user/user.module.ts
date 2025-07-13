import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent)
  },
  { 
    path: 'create-parcel', 
    loadComponent: () => import('./create-parcel/create-parcel.component').then(m => m.CreateParcelComponent)
  },
  { 
    path: 'my-parcels', 
    loadComponent: () => import('./my-parcels/my-parcels.component').then(m => m.MyParcelsComponent)
  },
  { 
    path: 'payments', 
    loadComponent: () => import('./payments/payments.component').then(m => m.PaymentsComponent)
  },
  { 
    path: 'support', 
    loadComponent: () => import('./support/support.component').then(m => m.SupportComponent)
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModule { }
