import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ParcelsComponent } from './parcels/parcels.component';
import { UsersComponent } from './users/users.component';
import { PaymentsComponent } from './payments/payments.component';
import { MetricsComponent } from './metrics/metrics.component';
import { SupportComponent } from './support/support.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'parcels', component: ParcelsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'metrics', component: MetricsComponent },
  { path: 'support', component: SupportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
