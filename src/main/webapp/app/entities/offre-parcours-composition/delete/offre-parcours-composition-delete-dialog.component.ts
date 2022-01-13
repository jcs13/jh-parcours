import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOffreParcoursComposition } from '../offre-parcours-composition.model';
import { OffreParcoursCompositionService } from '../service/offre-parcours-composition.service';

@Component({
  templateUrl: './offre-parcours-composition-delete-dialog.component.html',
})
export class OffreParcoursCompositionDeleteDialogComponent {
  offreParcoursComposition?: IOffreParcoursComposition;

  constructor(protected offreParcoursCompositionService: OffreParcoursCompositionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.offreParcoursCompositionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
