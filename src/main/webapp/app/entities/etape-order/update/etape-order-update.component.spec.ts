import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EtapeOrderService } from '../service/etape-order.service';
import { IEtapeOrder, EtapeOrder } from '../etape-order.model';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { ParcoursDefinitionService } from 'app/entities/parcours-definition/service/parcours-definition.service';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';
import { EtapeDefinitionService } from 'app/entities/etape-definition/service/etape-definition.service';

import { EtapeOrderUpdateComponent } from './etape-order-update.component';

describe('EtapeOrder Management Update Component', () => {
  let comp: EtapeOrderUpdateComponent;
  let fixture: ComponentFixture<EtapeOrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let etapeOrderService: EtapeOrderService;
  let parcoursDefinitionService: ParcoursDefinitionService;
  let etapeDefinitionService: EtapeDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EtapeOrderUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EtapeOrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtapeOrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    etapeOrderService = TestBed.inject(EtapeOrderService);
    parcoursDefinitionService = TestBed.inject(ParcoursDefinitionService);
    etapeDefinitionService = TestBed.inject(EtapeDefinitionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call parcoursDefinition query and add missing value', () => {
      const etapeOrder: IEtapeOrder = { id: 456 };
      const parcoursDefinition: IParcoursDefinition = { id: '9fa9491d-0980-493b-b530-1b09fcedb932' };
      etapeOrder.parcoursDefinition = parcoursDefinition;

      const parcoursDefinitionCollection: IParcoursDefinition[] = [{ id: 'f590848f-0339-4d5d-9dab-fcc44f4683fc' }];
      jest.spyOn(parcoursDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: parcoursDefinitionCollection })));
      const expectedCollection: IParcoursDefinition[] = [parcoursDefinition, ...parcoursDefinitionCollection];
      jest.spyOn(parcoursDefinitionService, 'addParcoursDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etapeOrder });
      comp.ngOnInit();

      expect(parcoursDefinitionService.query).toHaveBeenCalled();
      expect(parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing).toHaveBeenCalledWith(
        parcoursDefinitionCollection,
        parcoursDefinition
      );
      expect(comp.parcoursDefinitionsCollection).toEqual(expectedCollection);
    });

    it('Should call current query and add missing value', () => {
      const etapeOrder: IEtapeOrder = { id: 456 };
      const current: IEtapeDefinition = { id: 'df8f2ebf-16a3-47e0-afab-71aee8840b9c' };
      etapeOrder.current = current;

      const currentCollection: IEtapeDefinition[] = [{ id: '671d0611-0135-45d3-9a63-e299de5b58e9' }];
      jest.spyOn(etapeDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: currentCollection })));
      const expectedCollection: IEtapeDefinition[] = [current, ...currentCollection];
      jest.spyOn(etapeDefinitionService, 'addEtapeDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etapeOrder });
      comp.ngOnInit();

      expect(etapeDefinitionService.query).toHaveBeenCalled();
      expect(etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing).toHaveBeenCalledWith(currentCollection, current);
      expect(comp.currentsCollection).toEqual(expectedCollection);
    });

    it('Should call next query and add missing value', () => {
      const etapeOrder: IEtapeOrder = { id: 456 };
      const next: IEtapeDefinition = { id: 'a84891cf-eef7-4e97-9c39-ca464bc00762' };
      etapeOrder.next = next;

      const nextCollection: IEtapeDefinition[] = [{ id: 'd4dd9e3e-b83d-4ec5-ba6e-684dcc260380' }];
      jest.spyOn(etapeDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: nextCollection })));
      const expectedCollection: IEtapeDefinition[] = [next, ...nextCollection];
      jest.spyOn(etapeDefinitionService, 'addEtapeDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etapeOrder });
      comp.ngOnInit();

      expect(etapeDefinitionService.query).toHaveBeenCalled();
      expect(etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing).toHaveBeenCalledWith(nextCollection, next);
      expect(comp.nextsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const etapeOrder: IEtapeOrder = { id: 456 };
      const parcoursDefinition: IParcoursDefinition = { id: '906bdef1-225e-406a-8f19-19ea41c2d6e7' };
      etapeOrder.parcoursDefinition = parcoursDefinition;
      const current: IEtapeDefinition = { id: '21d172f3-da28-4ad3-a4c9-b5f970562fba' };
      etapeOrder.current = current;
      const next: IEtapeDefinition = { id: '32d31950-45ef-4f75-8647-f883898d1139' };
      etapeOrder.next = next;

      activatedRoute.data = of({ etapeOrder });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(etapeOrder));
      expect(comp.parcoursDefinitionsCollection).toContain(parcoursDefinition);
      expect(comp.currentsCollection).toContain(current);
      expect(comp.nextsCollection).toContain(next);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EtapeOrder>>();
      const etapeOrder = { id: 123 };
      jest.spyOn(etapeOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etapeOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etapeOrder }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(etapeOrderService.update).toHaveBeenCalledWith(etapeOrder);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EtapeOrder>>();
      const etapeOrder = new EtapeOrder();
      jest.spyOn(etapeOrderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etapeOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etapeOrder }));
      saveSubject.complete();

      // THEN
      expect(etapeOrderService.create).toHaveBeenCalledWith(etapeOrder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EtapeOrder>>();
      const etapeOrder = { id: 123 };
      jest.spyOn(etapeOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etapeOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(etapeOrderService.update).toHaveBeenCalledWith(etapeOrder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackParcoursDefinitionById', () => {
      it('Should return tracked ParcoursDefinition primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackParcoursDefinitionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEtapeDefinitionById', () => {
      it('Should return tracked EtapeDefinition primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackEtapeDefinitionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
