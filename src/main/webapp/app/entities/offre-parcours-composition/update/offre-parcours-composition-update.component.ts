import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOffreParcoursComposition, OffreParcoursComposition } from '../offre-parcours-composition.model';
import { OffreParcoursCompositionService } from '../service/offre-parcours-composition.service';
import { IOffre } from 'app/entities/offre/offre.model';
import { OffreService } from 'app/entities/offre/service/offre.service';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { ParcoursDefinitionService } from 'app/entities/parcours-definition/service/parcours-definition.service';

@Component({
  selector: 'jhi-offre-parcours-composition-update',
  templateUrl: './offre-parcours-composition-update.component.html',
})
export class OffreParcoursCompositionUpdateComponent implements OnInit {
  isSaving = false;

  offresCollection: IOffre[] = [];
  parcoursParentsCollection: IParcoursDefinition[] = [];
  parcoursChildrenCollection: IParcoursDefinition[] = [];

  editForm = this.fb.group({
    id: [],
    start: [],
    offre: [],
    parcoursParent: [],
    parcoursChild: [],
  });

  constructor(
    protected offreParcoursCompositionService: OffreParcoursCompositionService,
    protected offreService: OffreService,
    protected parcoursDefinitionService: ParcoursDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offreParcoursComposition }) => {
      this.updateForm(offreParcoursComposition);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const offreParcoursComposition = this.createFromForm();
    if (offreParcoursComposition.id !== undefined) {
      this.subscribeToSaveResponse(this.offreParcoursCompositionService.update(offreParcoursComposition));
    } else {
      this.subscribeToSaveResponse(this.offreParcoursCompositionService.create(offreParcoursComposition));
    }
  }

  trackOffreById(index: number, item: IOffre): string {
    return item.id!;
  }

  trackParcoursDefinitionById(index: number, item: IParcoursDefinition): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffreParcoursComposition>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(offreParcoursComposition: IOffreParcoursComposition): void {
    this.editForm.patchValue({
      id: offreParcoursComposition.id,
      start: offreParcoursComposition.start,
      offre: offreParcoursComposition.offre,
      parcoursParent: offreParcoursComposition.parcoursParent,
      parcoursChild: offreParcoursComposition.parcoursChild,
    });

    this.offresCollection = this.offreService.addOffreToCollectionIfMissing(this.offresCollection, offreParcoursComposition.offre);
    this.parcoursParentsCollection = this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
      this.parcoursParentsCollection,
      offreParcoursComposition.parcoursParent
    );
    this.parcoursChildrenCollection = this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
      this.parcoursChildrenCollection,
      offreParcoursComposition.parcoursChild
    );
  }

  protected loadRelationshipsOptions(): void {
    this.offreService
      .query({ filter: 'offreparcourscomposition-is-null' })
      .pipe(map((res: HttpResponse<IOffre[]>) => res.body ?? []))
      .pipe(map((offres: IOffre[]) => this.offreService.addOffreToCollectionIfMissing(offres, this.editForm.get('offre')!.value)))
      .subscribe((offres: IOffre[]) => (this.offresCollection = offres));

    this.parcoursDefinitionService
      .query({ filter: 'offreparcourscomposition-is-null' })
      .pipe(map((res: HttpResponse<IParcoursDefinition[]>) => res.body ?? []))
      .pipe(
        map((parcoursDefinitions: IParcoursDefinition[]) =>
          this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
            parcoursDefinitions,
            this.editForm.get('parcoursParent')!.value
          )
        )
      )
      .subscribe((parcoursDefinitions: IParcoursDefinition[]) => (this.parcoursParentsCollection = parcoursDefinitions));

    this.parcoursDefinitionService
      .query({ filter: 'offreparcourscomposition-is-null' })
      .pipe(map((res: HttpResponse<IParcoursDefinition[]>) => res.body ?? []))
      .pipe(
        map((parcoursDefinitions: IParcoursDefinition[]) =>
          this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
            parcoursDefinitions,
            this.editForm.get('parcoursChild')!.value
          )
        )
      )
      .subscribe((parcoursDefinitions: IParcoursDefinition[]) => (this.parcoursChildrenCollection = parcoursDefinitions));
  }

  protected createFromForm(): IOffreParcoursComposition {
    return {
      ...new OffreParcoursComposition(),
      id: this.editForm.get(['id'])!.value,
      start: this.editForm.get(['start'])!.value,
      offre: this.editForm.get(['offre'])!.value,
      parcoursParent: this.editForm.get(['parcoursParent'])!.value,
      parcoursChild: this.editForm.get(['parcoursChild'])!.value,
    };
  }
}
