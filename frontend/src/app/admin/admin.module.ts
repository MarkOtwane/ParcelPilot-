import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing.module';

import { NgChartsModule } from 'ng2-charts';



import { DashboardComponent } from './dashboard/dashboard.component';
import { ParcelsComponent } from './parcels/parcels.component';
import { UsersComponent } from './users/users.component';
import { PaymentsComponent } from './payments/payments.component';
import { MetricsComponent } from './metrics/metrics.component';
import { SupportComponent } from './support/support.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ParcelsComponent,
    UsersComponent,
    PaymentsComponent,
    MetricsComponent,
    SupportComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AdminRoutingModule,
    NgChartsModule
  
  ],
})
export class AdminModule {}
