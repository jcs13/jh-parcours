import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OffreParcoursCompositionService } from '../service/offre-parcours-composition.service';
import { IOffreParcoursComposition, OffreParcoursComposition } from '../offre-parcours-composition.model';
import { IOffre } from 'app/entities/offre/offre.model';
import { OffreService } from 'app/entities/offre/service/offre.service';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { ParcoursDefinitionService } from 'app/entities/parcours-definition/service/parcours-definition.service';

import { OffreParcoursCompositionUpdateComponent } from './offre-parcours-composition-update.component';

describe('OffreParcoursComposition Management Update Component', () => {
  let comp: OffreParcoursCompositionUpdateComponent;
  let fixture: ComponentFixture<OffreParcoursCompositionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let offreParcoursCompositionService: OffreParcoursCompositionService;
  let offreService: OffreService;
  let parcoursDefinitionService: ParcoursDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OffreParcoursCompositionUpdateComponent],
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
      .overrideTemplate(OffreParcoursCompositionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OffreParcoursCompositionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    offreParcoursCompositionService = TestBed.inject(OffreParcoursCompositionService);
    offreService = TestBed.inject(OffreService);
    parcoursDefinitionService = TestBed.inject(ParcoursDefinitionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call offre query and add missing value', () => {
      const offreParcoursComposition: IOffreParcoursComposition = { id: 456 };
      const offre: IOffre = { id: 'e9a82e83-837c-448d-88c6-347de9bbebc6' };
      offreParcoursComposition.offre = offre;

      const offreCollection: IOffre[] = [{ id: 'dc347a91-bb97-41af-97e6-986f62f6a8c1' }];
      jest.spyOn(offreService, 'query').mockReturnValue(of(new HttpResponse({ body: offreCollection })));
      const expectedCollection: IOffre[] = [offre, ...offreCollection];
      jest.spyOn(offreService, 'addOffreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offreParcoursComposition });
      comp.ngOnInit();

      expect(offreService.query).toHaveBeenCalled();
      expect(offreService.addOffreToCollectionIfMissing).toHaveBeenCalledWith(offreCollection, offre);
      expect(comp.offresCollection).toEqual(expectedCollection);
    });

    it('Should call parcoursParent query and add missing value', () => {
      const offreParcoursComposition: IOffreParcoursComposition = { id: 456 };
      const parcoursParent: IParcoursDefinition = { id: '19235ab5-2aa1-4eab-a1ae-4765289a4ebc' };
      offreParcoursComposition.parcoursParent = parcoursParent;

      const parcoursParentCollection: IParcoursDefinition[] = [{ id: '0af02cbb-b01a-4650-884c-1955caa20b1a' }];
      jest.spyOn(parcoursDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: parcoursParentCollection })));
      const expectedCollection: IParcoursDefinition[] = [parcoursParent, ...parcoursParentCollection];
      jest.spyOn(parcoursDefinitionService, 'addParcoursDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offreParcoursComposition });
      comp.ngOnInit();

      expect(parcoursDefinitionService.query).toHaveBeenCalled();
      expect(parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing).toHaveBeenCalledWith(
        parcoursParentCollection,
        parcoursParent
      );
      expect(comp.parcoursParentsCollection).toEqual(expectedCollection);
    });

    it('Should call parcoursChild query and add missing value', () => {
      const offreParcoursComposition: IOffreParcoursComposition = { id: 456 };
      const parcoursChild: IParcoursDefinition = { id: 'd0d9dbfd-29cb-40db-b4b2-5eaddc6d062c' };
      offreParcoursComposition.parcoursChild = parcoursChild;

      const parcoursChildCollection: IParcoursDefinition[] = [{ id: 'ccc4231e-98cf-4009-9b1d-16c6d36325e5' }];
      jest.spyOn(parcoursDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: parcoursChildCollection })));
      const expectedCollection: IParcoursDefinition[] = [parcoursChild, ...parcoursChildCollection];
      jest.spyOn(parcoursDefinitionService, 'addParcoursDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offreParcoursComposition });
      comp.ngOnInit();

      expect(parcoursDefinitionService.query).toHaveBeenCalled();
      expect(parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing).toHaveBeenCalledWith(
        parcoursChildCollection,
        parcoursChild
      );
      expect(comp.parcoursChildrenCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const offreParcoursComposition: IOffreParcoursComposition = { id: 456 };
      const offre: IOffre = { id: 'e5f6c0cc-c3ee-455b-b461-d7f0ea20e2bb' };
      offreParcoursComposition.offre = offre;
      const parcoursParent: IParcoursDefinition = { id: '884de912-4002-4caa-82c5-fc303415b6b5' };
      offreParcoursComposition.parcoursParent = parcoursParent;
      const parcoursChild: IParcoursDefinition = { id: '67e5d448-d74a-4649-908d-38cdba3c2479' };
      offreParcoursComposition.parcoursChild = parcoursChild;

      activatedRoute.data = of({ offreParcoursComposition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(offreParcoursComposition));
      expect(comp.offresCollection).toContain(offre);
      expect(comp.parcoursParentsCollection).toContain(parcoursParent);
      expect(comp.parcoursChildrenCollection).toContain(parcoursChild);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OffreParcoursComposition>>();
      const offreParcoursComposition = { id: 123 };
      jest.spyOn(offreParcoursCompositionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offreParcoursComposition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offreParcoursComposition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(offreParcoursCompositionService.update).toHaveBeenCalledWith(offreParcoursComposition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OffreParcoursComposition>>();
      const offreParcoursComposition = new OffreParcoursComposition();
      jest.spyOn(offreParcoursCompositionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offreParcoursComposition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offreParcoursComposition }));
      saveSubject.complete();

      // THEN
      expect(offreParcoursCompositionService.create).toHaveBeenCalledWith(offreParcoursComposition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OffreParcoursComposition>>();
      const offreParcoursComposition = { id: 123 };
      jest.spyOn(offreParcoursCompositionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offreParcoursComposition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(offreParcoursCompositionService.update).toHaveBeenCalledWith(offreParcoursComposition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackOffreById', () => {
      it('Should return tracked Offre primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackOffreById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackParcoursDefinitionById', () => {
      it('Should return tracked ParcoursDefinition primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackParcoursDefinitionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
