import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OffreParcoursCompositionComponent } from './list/offre-parcours-composition.component';
import { OffreParcoursCompositionDetailComponent } from './detail/offre-parcours-composition-detail.component';
import { OffreParcoursCompositionUpdateComponent } from './update/offre-parcours-composition-update.component';
import { OffreParcoursCompositionDeleteDialogComponent } from './delete/offre-parcours-composition-delete-dialog.component';
import { OffreParcoursCompositionRoutingModule } from './route/offre-parcours-composition-routing.module';

@NgModule({
  imports: [SharedModule, OffreParcoursCompositionRoutingModule],
  declarations: [
    OffreParcoursCompositionComponent,
    OffreParcoursCompositionDetailComponent,
    OffreParcoursCompositionUpdateComponent,
    OffreParcoursCompositionDeleteDialogComponent,
  ],
  entryComponents: [OffreParcoursCompositionDeleteDialogComponent],
})
export class OffreParcoursCompositionModule {}
