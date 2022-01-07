import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IParcours, Parcours } from '../parcours.model';
import { ParcoursService } from '../service/parcours.service';

@Component({
  selector: 'jhi-parcours-update',
  templateUrl: './parcours-update.component.html',
})
export class ParcoursUpdateComponent implements OnInit {
  isSaving = false;

  parcoursSharedCollection: IParcours[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    parent: [],
  });

  constructor(protected parcoursService: ParcoursService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parcours }) => {
      this.updateForm(parcours);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parcours = this.createFromForm();
    if (parcours.id !== undefined) {
      this.subscribeToSaveResponse(this.parcoursService.update(parcours));
    } else {
      this.subscribeToSaveResponse(this.parcoursService.create(parcours));
    }
  }

  trackParcoursById(index: number, item: IParcours): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParcours>>): void {
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

  protected updateForm(parcours: IParcours): void {
    this.editForm.patchValue({
      id: parcours.id,
      name: parcours.name,
      parent: parcours.parent,
    });

    this.parcoursSharedCollection = this.parcoursService.addParcoursToCollectionIfMissing(this.parcoursSharedCollection, parcours.parent);
  }

  protected loadRelationshipsOptions(): void {
    this.parcoursService
      .query()
      .pipe(map((res: HttpResponse<IParcours[]>) => res.body ?? []))
      .pipe(
        map((parcours: IParcours[]) => this.parcoursService.addParcoursToCollectionIfMissing(parcours, this.editForm.get('parent')!.value))
      )
      .subscribe((parcours: IParcours[]) => (this.parcoursSharedCollection = parcours));
  }

  protected createFromForm(): IParcours {
    return {
      ...new Parcours(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      parent: this.editForm.get(['parent'])!.value,
    };
  }
}
