import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BlocOrderComponent } from '../list/bloc-order.component';
import { BlocOrderDetailComponent } from '../detail/bloc-order-detail.component';
import { BlocOrderUpdateComponent } from '../update/bloc-order-update.component';
import { BlocOrderRoutingResolveService } from './bloc-order-routing-resolve.service';

const blocOrderRoute: Routes = [
  {
    path: '',
    component: BlocOrderComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BlocOrderDetailComponent,
    resolve: {
      blocOrder: BlocOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BlocOrderUpdateComponent,
    resolve: {
      blocOrder: BlocOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BlocOrderUpdateComponent,
    resolve: {
      blocOrder: BlocOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(blocOrderRoute)],
  exports: [RouterModule],
})
export class BlocOrderRoutingModule {}
