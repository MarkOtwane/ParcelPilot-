import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { ParcelsComponent } from './parcels/parcels.component';
import { PaymentsComponent } from './payments/payments.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    ParcelsComponent,
    PaymentsComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, UserRoutingModule],
})
export class UserModule {}
