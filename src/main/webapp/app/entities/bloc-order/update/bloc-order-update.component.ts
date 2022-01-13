import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBlocOrder, BlocOrder } from '../bloc-order.model';
import { BlocOrderService } from '../service/bloc-order.service';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';
import { EtapeDefinitionService } from 'app/entities/etape-definition/service/etape-definition.service';
import { IBlocDefinition } from 'app/entities/bloc-definition/bloc-definition.model';
import { BlocDefinitionService } from 'app/entities/bloc-definition/service/bloc-definition.service';

@Component({
  selector: 'jhi-bloc-order-update',
  templateUrl: './bloc-order-update.component.html',
})
export class BlocOrderUpdateComponent implements OnInit {
  isSaving = false;

  etapeDefinitionsCollection: IEtapeDefinition[] = [];
  currentsCollection: IBlocDefinition[] = [];
  nextsCollection: IBlocDefinition[] = [];

  editForm = this.fb.group({
    id: [],
    start: [],
    etapeDefinition: [],
    current: [],
    next: [],
  });

  constructor(
    protected blocOrderService: BlocOrderService,
    protected etapeDefinitionService: EtapeDefinitionService,
    protected blocDefinitionService: BlocDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blocOrder }) => {
      this.updateForm(blocOrder);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const blocOrder = this.createFromForm();
    if (blocOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.blocOrderService.update(blocOrder));
    } else {
      this.subscribeToSaveResponse(this.blocOrderService.create(blocOrder));
    }
  }

  trackEtapeDefinitionById(index: number, item: IEtapeDefinition): string {
    return item.id!;
  }

  trackBlocDefinitionById(index: number, item: IBlocDefinition): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlocOrder>>): void {
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

  protected updateForm(blocOrder: IBlocOrder): void {
    this.editForm.patchValue({
      id: blocOrder.id,
      start: blocOrder.start,
      etapeDefinition: blocOrder.etapeDefinition,
      current: blocOrder.current,
      next: blocOrder.next,
    });

    this.etapeDefinitionsCollection = this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(
      this.etapeDefinitionsCollection,
      blocOrder.etapeDefinition
    );
    this.currentsCollection = this.blocDefinitionService.addBlocDefinitionToCollectionIfMissing(this.currentsCollection, blocOrder.current);
    this.nextsCollection = this.blocDefinitionService.addBlocDefinitionToCollectionIfMissing(this.nextsCollection, blocOrder.next);
  }

  protected loadRelationshipsOptions(): void {
    this.etapeDefinitionService
      .query({ filter: 'blocorder-is-null' })
      .pipe(map((res: HttpResponse<IEtapeDefinition[]>) => res.body ?? []))
      .pipe(
        map((etapeDefinitions: IEtapeDefinition[]) =>
          this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(etapeDefinitions, this.editForm.get('etapeDefinition')!.value)
        )
      )
      .subscribe((etapeDefinitions: IEtapeDefinition[]) => (this.etapeDefinitionsCollection = etapeDefinitions));

    this.blocDefinitionService
      .query({ filter: 'blocorder-is-null' })
      .pipe(map((res: HttpResponse<IBlocDefinition[]>) => res.body ?? []))
      .pipe(
        map((blocDefinitions: IBlocDefinition[]) =>
          this.blocDefinitionService.addBlocDefinitionToCollectionIfMissing(blocDefinitions, this.editForm.get('current')!.value)
        )
      )
      .subscribe((blocDefinitions: IBlocDefinition[]) => (this.currentsCollection = blocDefinitions));

    this.blocDefinitionService
      .query({ filter: 'blocorder-is-null' })
      .pipe(map((res: HttpResponse<IBlocDefinition[]>) => res.body ?? []))
      .pipe(
        map((blocDefinitions: IBlocDefinition[]) =>
          this.blocDefinitionService.addBlocDefinitionToCollectionIfMissing(blocDefinitions, this.editForm.get('next')!.value)
        )
      )
      .subscribe((blocDefinitions: IBlocDefinition[]) => (this.nextsCollection = blocDefinitions));
  }

  protected createFromForm(): IBlocOrder {
    return {
      ...new BlocOrder(),
      id: this.editForm.get(['id'])!.value,
      start: this.editForm.get(['start'])!.value,
      etapeDefinition: this.editForm.get(['etapeDefinition'])!.value,
      current: this.editForm.get(['current'])!.value,
      next: this.editForm.get(['next'])!.value,
    };
  }
}
