import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EtapeOrderComponent } from '../list/etape-order.component';
import { EtapeOrderDetailComponent } from '../detail/etape-order-detail.component';
import { EtapeOrderUpdateComponent } from '../update/etape-order-update.component';
import { EtapeOrderRoutingResolveService } from './etape-order-routing-resolve.service';

const etapeOrderRoute: Routes = [
  {
    path: '',
    component: EtapeOrderComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EtapeOrderDetailComponent,
    resolve: {
      etapeOrder: EtapeOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EtapeOrderUpdateComponent,
    resolve: {
      etapeOrder: EtapeOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EtapeOrderUpdateComponent,
    resolve: {
      etapeOrder: EtapeOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(etapeOrderRoute)],
  exports: [RouterModule],
})
export class EtapeOrderRoutingModule {}
