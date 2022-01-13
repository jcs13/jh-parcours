import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOffreParcoursComposition } from '../offre-parcours-composition.model';

@Component({
  selector: 'jhi-offre-parcours-composition-detail',
  templateUrl: './offre-parcours-composition-detail.component.html',
})
export class OffreParcoursCompositionDetailComponent implements OnInit {
  offreParcoursComposition: IOffreParcoursComposition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offreParcoursComposition }) => {
      this.offreParcoursComposition = offreParcoursComposition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
