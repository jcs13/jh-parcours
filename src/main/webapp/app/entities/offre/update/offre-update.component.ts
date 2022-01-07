import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOffre, Offre } from '../offre.model';
import { OffreService } from '../service/offre.service';
import { IParcours } from 'app/entities/parcours/parcours.model';
import { ParcoursService } from 'app/entities/parcours/service/parcours.service';

@Component({
  selector: 'jhi-offre-update',
  templateUrl: './offre-update.component.html',
})
export class OffreUpdateComponent implements OnInit {
  isSaving = false;

  parcoursSharedCollection: IParcours[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    parcours: [],
  });

  constructor(
    protected offreService: OffreService,
    protected parcoursService: ParcoursService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offre }) => {
      this.updateForm(offre);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const offre = this.createFromForm();
    if (offre.id !== undefined) {
      this.subscribeToSaveResponse(this.offreService.update(offre));
    } else {
      this.subscribeToSaveResponse(this.offreService.create(offre));
    }
  }

  trackParcoursById(index: number, item: IParcours): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffre>>): void {
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

  protected updateForm(offre: IOffre): void {
    this.editForm.patchValue({
      id: offre.id,
      name: offre.name,
      parcours: offre.parcours,
    });

    this.parcoursSharedCollection = this.parcoursService.addParcoursToCollectionIfMissing(this.parcoursSharedCollection, offre.parcours);
  }

  protected loadRelationshipsOptions(): void {
    this.parcoursService
      .query()
      .pipe(map((res: HttpResponse<IParcours[]>) => res.body ?? []))
      .pipe(
        map((parcours: IParcours[]) =>
          this.parcoursService.addParcoursToCollectionIfMissing(parcours, this.editForm.get('parcours')!.value)
        )
      )
      .subscribe((parcours: IParcours[]) => (this.parcoursSharedCollection = parcours));
  }

  protected createFromForm(): IOffre {
    return {
      ...new Offre(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      parcours: this.editForm.get(['parcours'])!.value,
    };
  }
}
