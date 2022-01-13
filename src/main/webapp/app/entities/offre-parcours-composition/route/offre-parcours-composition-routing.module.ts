import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OffreParcoursCompositionComponent } from '../list/offre-parcours-composition.component';
import { OffreParcoursCompositionDetailComponent } from '../detail/offre-parcours-composition-detail.component';
import { OffreParcoursCompositionUpdateComponent } from '../update/offre-parcours-composition-update.component';
import { OffreParcoursCompositionRoutingResolveService } from './offre-parcours-composition-routing-resolve.service';

const offreParcoursCompositionRoute: Routes = [
  {
    path: '',
    component: OffreParcoursCompositionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OffreParcoursCompositionDetailComponent,
    resolve: {
      offreParcoursComposition: OffreParcoursCompositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OffreParcoursCompositionUpdateComponent,
    resolve: {
      offreParcoursComposition: OffreParcoursCompositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OffreParcoursCompositionUpdateComponent,
    resolve: {
      offreParcoursComposition: OffreParcoursCompositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(offreParcoursCompositionRoute)],
  exports: [RouterModule],
})
export class OffreParcoursCompositionRoutingModule {}
