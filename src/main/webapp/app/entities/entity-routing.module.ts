import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'parcours',
        data: { pageTitle: 'Parcours' },
        loadChildren: () => import('./parcours/parcours.module').then(m => m.ParcoursModule),
      },
      {
        path: 'offre',
        data: { pageTitle: 'Offres' },
        loadChildren: () => import('./offre/offre.module').then(m => m.OffreModule),
      },
      {
        path: 'etape',
        data: { pageTitle: 'Etapes' },
        loadChildren: () => import('./etape/etape.module').then(m => m.EtapeModule),
      },
      {
        path: 'bloc',
        data: { pageTitle: 'Blocs' },
        loadChildren: () => import('./bloc/bloc.module').then(m => m.BlocModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
