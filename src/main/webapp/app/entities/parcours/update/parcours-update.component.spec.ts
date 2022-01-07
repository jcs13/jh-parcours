import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParcoursService } from '../service/parcours.service';
import { IParcours, Parcours } from '../parcours.model';

import { ParcoursUpdateComponent } from './parcours-update.component';

describe('Parcours Management Update Component', () => {
  let comp: ParcoursUpdateComponent;
  let fixture: ComponentFixture<ParcoursUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parcoursService: ParcoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParcoursUpdateComponent],
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
      .overrideTemplate(ParcoursUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParcoursUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parcoursService = TestBed.inject(ParcoursService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Parcours query and add missing value', () => {
      const parcours: IParcours = { id: 456 };
      const parent: IParcours = { id: 20074 };
      parcours.parent = parent;

      const parcoursCollection: IParcours[] = [{ id: 95971 }];
      jest.spyOn(parcoursService, 'query').mockReturnValue(of(new HttpResponse({ body: parcoursCollection })));
      const additionalParcours = [parent];
      const expectedCollection: IParcours[] = [...additionalParcours, ...parcoursCollection];
      jest.spyOn(parcoursService, 'addParcoursToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parcours });
      comp.ngOnInit();

      expect(parcoursService.query).toHaveBeenCalled();
      expect(parcoursService.addParcoursToCollectionIfMissing).toHaveBeenCalledWith(parcoursCollection, ...additionalParcours);
      expect(comp.parcoursSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const parcours: IParcours = { id: 456 };
      const parent: IParcours = { id: 98527 };
      parcours.parent = parent;

      activatedRoute.data = of({ parcours });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(parcours));
      expect(comp.parcoursSharedCollection).toContain(parent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Parcours>>();
      const parcours = { id: 123 };
      jest.spyOn(parcoursService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parcours });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parcours }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(parcoursService.update).toHaveBeenCalledWith(parcours);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Parcours>>();
      const parcours = new Parcours();
      jest.spyOn(parcoursService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parcours });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parcours }));
      saveSubject.complete();

      // THEN
      expect(parcoursService.create).toHaveBeenCalledWith(parcours);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Parcours>>();
      const parcours = { id: 123 };
      jest.spyOn(parcoursService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parcours });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parcoursService.update).toHaveBeenCalledWith(parcours);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackParcoursById', () => {
      it('Should return tracked Parcours primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackParcoursById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
