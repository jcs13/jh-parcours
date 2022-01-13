import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BlocDefinitionService } from '../service/bloc-definition.service';
import { IBlocDefinition, BlocDefinition } from '../bloc-definition.model';
import { IElement } from 'app/entities/element/element.model';
import { ElementService } from 'app/entities/element/service/element.service';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';
import { EtapeDefinitionService } from 'app/entities/etape-definition/service/etape-definition.service';

import { BlocDefinitionUpdateComponent } from './bloc-definition-update.component';

describe('BlocDefinition Management Update Component', () => {
  let comp: BlocDefinitionUpdateComponent;
  let fixture: ComponentFixture<BlocDefinitionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let blocDefinitionService: BlocDefinitionService;
  let elementService: ElementService;
  let etapeDefinitionService: EtapeDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BlocDefinitionUpdateComponent],
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
      .overrideTemplate(BlocDefinitionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlocDefinitionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    blocDefinitionService = TestBed.inject(BlocDefinitionService);
    elementService = TestBed.inject(ElementService);
    etapeDefinitionService = TestBed.inject(EtapeDefinitionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call element query and add missing value', () => {
      const blocDefinition: IBlocDefinition = { id: 'CBA' };
      const element: IElement = { id: '66dbf579-6f78-43ae-9993-b4a95b9fd05f' };
      blocDefinition.element = element;

      const elementCollection: IElement[] = [{ id: '0b330669-4295-471f-963f-3c2de8d1b0e0' }];
      jest.spyOn(elementService, 'query').mockReturnValue(of(new HttpResponse({ body: elementCollection })));
      const expectedCollection: IElement[] = [element, ...elementCollection];
      jest.spyOn(elementService, 'addElementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blocDefinition });
      comp.ngOnInit();

      expect(elementService.query).toHaveBeenCalled();
      expect(elementService.addElementToCollectionIfMissing).toHaveBeenCalledWith(elementCollection, element);
      expect(comp.elementsCollection).toEqual(expectedCollection);
    });

    it('Should call EtapeDefinition query and add missing value', () => {
      const blocDefinition: IBlocDefinition = { id: 'CBA' };
      const etapeDefinition: IEtapeDefinition = { id: '42b8af46-f2c2-42c3-a239-6fbda64dbaef' };
      blocDefinition.etapeDefinition = etapeDefinition;

      const etapeDefinitionCollection: IEtapeDefinition[] = [{ id: 'ab61f1f9-949b-4280-a85b-cef9de3be8f1' }];
      jest.spyOn(etapeDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: etapeDefinitionCollection })));
      const additionalEtapeDefinitions = [etapeDefinition];
      const expectedCollection: IEtapeDefinition[] = [...additionalEtapeDefinitions, ...etapeDefinitionCollection];
      jest.spyOn(etapeDefinitionService, 'addEtapeDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blocDefinition });
      comp.ngOnInit();

      expect(etapeDefinitionService.query).toHaveBeenCalled();
      expect(etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing).toHaveBeenCalledWith(
        etapeDefinitionCollection,
        ...additionalEtapeDefinitions
      );
      expect(comp.etapeDefinitionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const blocDefinition: IBlocDefinition = { id: 'CBA' };
      const element: IElement = { id: '87ec0697-d32c-4d05-bbba-f0ca75bc8d6b' };
      blocDefinition.element = element;
      const etapeDefinition: IEtapeDefinition = { id: '793bd910-cba9-4769-b5da-f06e7b7b1068' };
      blocDefinition.etapeDefinition = etapeDefinition;

      activatedRoute.data = of({ blocDefinition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(blocDefinition));
      expect(comp.elementsCollection).toContain(element);
      expect(comp.etapeDefinitionsSharedCollection).toContain(etapeDefinition);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlocDefinition>>();
      const blocDefinition = { id: 'ABC' };
      jest.spyOn(blocDefinitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blocDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blocDefinition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(blocDefinitionService.update).toHaveBeenCalledWith(blocDefinition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlocDefinition>>();
      const blocDefinition = new BlocDefinition();
      jest.spyOn(blocDefinitionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blocDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blocDefinition }));
      saveSubject.complete();

      // THEN
      expect(blocDefinitionService.create).toHaveBeenCalledWith(blocDefinition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlocDefinition>>();
      const blocDefinition = { id: 'ABC' };
      jest.spyOn(blocDefinitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blocDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(blocDefinitionService.update).toHaveBeenCalledWith(blocDefinition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackElementById', () => {
      it('Should return tracked Element primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackElementById(0, entity);
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
