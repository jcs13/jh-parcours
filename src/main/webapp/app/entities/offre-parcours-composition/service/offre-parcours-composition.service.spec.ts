import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOffreParcoursComposition, OffreParcoursComposition } from '../offre-parcours-composition.model';

import { OffreParcoursCompositionService } from './offre-parcours-composition.service';

describe('OffreParcoursComposition Service', () => {
  let service: OffreParcoursCompositionService;
  let httpMock: HttpTestingController;
  let elemDefault: IOffreParcoursComposition;
  let expectedResult: IOffreParcoursComposition | IOffreParcoursComposition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OffreParcoursCompositionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      start: false,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a OffreParcoursComposition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new OffreParcoursComposition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OffreParcoursComposition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          start: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OffreParcoursComposition', () => {
      const patchObject = Object.assign(
        {
          start: true,
        },
        new OffreParcoursComposition()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OffreParcoursComposition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          start: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a OffreParcoursComposition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOffreParcoursCompositionToCollectionIfMissing', () => {
      it('should add a OffreParcoursComposition to an empty array', () => {
        const offreParcoursComposition: IOffreParcoursComposition = { id: 123 };
        expectedResult = service.addOffreParcoursCompositionToCollectionIfMissing([], offreParcoursComposition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offreParcoursComposition);
      });

      it('should not add a OffreParcoursComposition to an array that contains it', () => {
        const offreParcoursComposition: IOffreParcoursComposition = { id: 123 };
        const offreParcoursCompositionCollection: IOffreParcoursComposition[] = [
          {
            ...offreParcoursComposition,
          },
          { id: 456 },
        ];
        expectedResult = service.addOffreParcoursCompositionToCollectionIfMissing(
          offreParcoursCompositionCollection,
          offreParcoursComposition
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OffreParcoursComposition to an array that doesn't contain it", () => {
        const offreParcoursComposition: IOffreParcoursComposition = { id: 123 };
        const offreParcoursCompositionCollection: IOffreParcoursComposition[] = [{ id: 456 }];
        expectedResult = service.addOffreParcoursCompositionToCollectionIfMissing(
          offreParcoursCompositionCollection,
          offreParcoursComposition
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offreParcoursComposition);
      });

      it('should add only unique OffreParcoursComposition to an array', () => {
        const offreParcoursCompositionArray: IOffreParcoursComposition[] = [{ id: 123 }, { id: 456 }, { id: 56606 }];
        const offreParcoursCompositionCollection: IOffreParcoursComposition[] = [{ id: 123 }];
        expectedResult = service.addOffreParcoursCompositionToCollectionIfMissing(
          offreParcoursCompositionCollection,
          ...offreParcoursCompositionArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const offreParcoursComposition: IOffreParcoursComposition = { id: 123 };
        const offreParcoursComposition2: IOffreParcoursComposition = { id: 456 };
        expectedResult = service.addOffreParcoursCompositionToCollectionIfMissing([], offreParcoursComposition, offreParcoursComposition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offreParcoursComposition);
        expect(expectedResult).toContain(offreParcoursComposition2);
      });

      it('should accept null and undefined values', () => {
        const offreParcoursComposition: IOffreParcoursComposition = { id: 123 };
        expectedResult = service.addOffreParcoursCompositionToCollectionIfMissing([], null, offreParcoursComposition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offreParcoursComposition);
      });

      it('should return initial array if no OffreParcoursComposition is added', () => {
        const offreParcoursCompositionCollection: IOffreParcoursComposition[] = [{ id: 123 }];
        expectedResult = service.addOffreParcoursCompositionToCollectionIfMissing(offreParcoursCompositionCollection, undefined, null);
        expect(expectedResult).toEqual(offreParcoursCompositionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
