import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEtapeOrder, EtapeOrder } from '../etape-order.model';
import { EtapeOrderService } from '../service/etape-order.service';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { ParcoursDefinitionService } from 'app/entities/parcours-definition/service/parcours-definition.service';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';
import { EtapeDefinitionService } from 'app/entities/etape-definition/service/etape-definition.service';

@Component({
  selector: 'jhi-etape-order-update',
  templateUrl: './etape-order-update.component.html',
})
export class EtapeOrderUpdateComponent implements OnInit {
  isSaving = false;

  parcoursDefinitionsCollection: IParcoursDefinition[] = [];
  currentsCollection: IEtapeDefinition[] = [];
  nextsCollection: IEtapeDefinition[] = [];

  editForm = this.fb.group({
    id: [],
    start: [],
    parcoursDefinition: [],
    current: [],
    next: [],
  });

  constructor(
    protected etapeOrderService: EtapeOrderService,
    protected parcoursDefinitionService: ParcoursDefinitionService,
    protected etapeDefinitionService: EtapeDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etapeOrder }) => {
      this.updateForm(etapeOrder);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etapeOrder = this.createFromForm();
    if (etapeOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.etapeOrderService.update(etapeOrder));
    } else {
      this.subscribeToSaveResponse(this.etapeOrderService.create(etapeOrder));
    }
  }

  trackParcoursDefinitionById(index: number, item: IParcoursDefinition): string {
    return item.id!;
  }

  trackEtapeDefinitionById(index: number, item: IEtapeDefinition): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtapeOrder>>): void {
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

  protected updateForm(etapeOrder: IEtapeOrder): void {
    this.editForm.patchValue({
      id: etapeOrder.id,
      start: etapeOrder.start,
      parcoursDefinition: etapeOrder.parcoursDefinition,
      current: etapeOrder.current,
      next: etapeOrder.next,
    });

    this.parcoursDefinitionsCollection = this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
      this.parcoursDefinitionsCollection,
      etapeOrder.parcoursDefinition
    );
    this.currentsCollection = this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(
      this.currentsCollection,
      etapeOrder.current
    );
    this.nextsCollection = this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(this.nextsCollection, etapeOrder.next);
  }

  protected loadRelationshipsOptions(): void {
    this.parcoursDefinitionService
      .query({ filter: 'etapeorder-is-null' })
      .pipe(map((res: HttpResponse<IParcoursDefinition[]>) => res.body ?? []))
      .pipe(
        map((parcoursDefinitions: IParcoursDefinition[]) =>
          this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
            parcoursDefinitions,
            this.editForm.get('parcoursDefinition')!.value
          )
        )
      )
      .subscribe((parcoursDefinitions: IParcoursDefinition[]) => (this.parcoursDefinitionsCollection = parcoursDefinitions));

    this.etapeDefinitionService
      .query({ filter: 'etapeorder-is-null' })
      .pipe(map((res: HttpResponse<IEtapeDefinition[]>) => res.body ?? []))
      .pipe(
        map((etapeDefinitions: IEtapeDefinition[]) =>
          this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(etapeDefinitions, this.editForm.get('current')!.value)
        )
      )
      .subscribe((etapeDefinitions: IEtapeDefinition[]) => (this.currentsCollection = etapeDefinitions));

    this.etapeDefinitionService
      .query({ filter: 'etapeorder-is-null' })
      .pipe(map((res: HttpResponse<IEtapeDefinition[]>) => res.body ?? []))
      .pipe(
        map((etapeDefinitions: IEtapeDefinition[]) =>
          this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(etapeDefinitions, this.editForm.get('next')!.value)
        )
      )
      .subscribe((etapeDefinitions: IEtapeDefinition[]) => (this.nextsCollection = etapeDefinitions));
  }

  protected createFromForm(): IEtapeOrder {
    return {
      ...new EtapeOrder(),
      id: this.editForm.get(['id'])!.value,
      start: this.editForm.get(['start'])!.value,
      parcoursDefinition: this.editForm.get(['parcoursDefinition'])!.value,
      current: this.editForm.get(['current'])!.value,
      next: this.editForm.get(['next'])!.value,
    };
  }
}
