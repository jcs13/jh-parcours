import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOffreParcoursComposition } from '../offre-parcours-composition.model';
import { OffreParcoursCompositionService } from '../service/offre-parcours-composition.service';
import { OffreParcoursCompositionDeleteDialogComponent } from '../delete/offre-parcours-composition-delete-dialog.component';

@Component({
  selector: 'jhi-offre-parcours-composition',
  templateUrl: './offre-parcours-composition.component.html',
})
export class OffreParcoursCompositionComponent implements OnInit {
  offreParcoursCompositions?: IOffreParcoursComposition[];
  isLoading = false;

  constructor(protected offreParcoursCompositionService: OffreParcoursCompositionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.offreParcoursCompositionService.query().subscribe({
      next: (res: HttpResponse<IOffreParcoursComposition[]>) => {
        this.isLoading = false;
        this.offreParcoursCompositions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOffreParcoursComposition): number {
    return item.id!;
  }

  delete(offreParcoursComposition: IOffreParcoursComposition): void {
    const modalRef = this.modalService.open(OffreParcoursCompositionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.offreParcoursComposition = offreParcoursComposition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
