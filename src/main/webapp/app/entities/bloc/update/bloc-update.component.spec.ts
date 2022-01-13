import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BlocService } from '../service/bloc.service';
import { IBloc, Bloc } from '../bloc.model';
import { IEtape } from 'app/entities/etape/etape.model';
import { EtapeService } from 'app/entities/etape/service/etape.service';

import { BlocUpdateComponent } from './bloc-update.component';

describe('Bloc Management Update Component', () => {
  let comp: BlocUpdateComponent;
  let fixture: ComponentFixture<BlocUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let blocService: BlocService;
  let etapeService: EtapeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BlocUpdateComponent],
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
      .overrideTemplate(BlocUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlocUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    blocService = TestBed.inject(BlocService);
    etapeService = TestBed.inject(EtapeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Etape query and add missing value', () => {
      const bloc: IBloc = { id: 'CBA' };
      const etape: IEtape = { id: 'f0baa60c-c5c1-4fec-862b-9799776838c2' };
      bloc.etape = etape;

      const etapeCollection: IEtape[] = [{ id: 'f7c9b3f8-202d-40b0-8f69-c64b5471db97' }];
      jest.spyOn(etapeService, 'query').mockReturnValue(of(new HttpResponse({ body: etapeCollection })));
      const additionalEtapes = [etape];
      const expectedCollection: IEtape[] = [...additionalEtapes, ...etapeCollection];
      jest.spyOn(etapeService, 'addEtapeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bloc });
      comp.ngOnInit();

      expect(etapeService.query).toHaveBeenCalled();
      expect(etapeService.addEtapeToCollectionIfMissing).toHaveBeenCalledWith(etapeCollection, ...additionalEtapes);
      expect(comp.etapesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bloc: IBloc = { id: 'CBA' };
      const etape: IEtape = { id: '9716801b-87fe-4208-ba75-2ec6b0f02a21' };
      bloc.etape = etape;

      activatedRoute.data = of({ bloc });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(bloc));
      expect(comp.etapesSharedCollection).toContain(etape);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bloc>>();
      const bloc = { id: 'ABC' };
      jest.spyOn(blocService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bloc });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bloc }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(blocService.update).toHaveBeenCalledWith(bloc);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bloc>>();
      const bloc = new Bloc();
      jest.spyOn(blocService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bloc });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bloc }));
      saveSubject.complete();

      // THEN
      expect(blocService.create).toHaveBeenCalledWith(bloc);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bloc>>();
      const bloc = { id: 'ABC' };
      jest.spyOn(blocService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bloc });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(blocService.update).toHaveBeenCalledWith(bloc);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEtapeById', () => {
      it('Should return tracked Etape primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackEtapeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
