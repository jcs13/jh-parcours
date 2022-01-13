import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IParcours, Parcours } from '../parcours.model';

import { ParcoursService } from './parcours.service';

describe('Parcours Service', () => {
  let service: ParcoursService;
  let httpMock: HttpTestingController;
  let elemDefault: IParcours;
  let expectedResult: IParcours | IParcours[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParcoursService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      name: 'AAAAAAA',
      label: 'AAAAAAA',
      offreId: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Parcours', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Parcours()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Parcours', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          label: 'BBBBBB',
          offreId: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Parcours', () => {
      const patchObject = Object.assign(
        {
          label: 'BBBBBB',
        },
        new Parcours()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Parcours', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          label: 'BBBBBB',
          offreId: 'BBBBBB',
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

    it('should delete a Parcours', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addParcoursToCollectionIfMissing', () => {
      it('should add a Parcours to an empty array', () => {
        const parcours: IParcours = { id: 'ABC' };
        expectedResult = service.addParcoursToCollectionIfMissing([], parcours);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parcours);
      });

      it('should not add a Parcours to an array that contains it', () => {
        const parcours: IParcours = { id: 'ABC' };
        const parcoursCollection: IParcours[] = [
          {
            ...parcours,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addParcoursToCollectionIfMissing(parcoursCollection, parcours);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Parcours to an array that doesn't contain it", () => {
        const parcours: IParcours = { id: 'ABC' };
        const parcoursCollection: IParcours[] = [{ id: 'CBA' }];
        expectedResult = service.addParcoursToCollectionIfMissing(parcoursCollection, parcours);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parcours);
      });

      it('should add only unique Parcours to an array', () => {
        const parcoursArray: IParcours[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '8110d65d-979b-4d6a-bd4a-b05d2f52bada' }];
        const parcoursCollection: IParcours[] = [{ id: 'ABC' }];
        expectedResult = service.addParcoursToCollectionIfMissing(parcoursCollection, ...parcoursArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const parcours: IParcours = { id: 'ABC' };
        const parcours2: IParcours = { id: 'CBA' };
        expectedResult = service.addParcoursToCollectionIfMissing([], parcours, parcours2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parcours);
        expect(expectedResult).toContain(parcours2);
      });

      it('should accept null and undefined values', () => {
        const parcours: IParcours = { id: 'ABC' };
        expectedResult = service.addParcoursToCollectionIfMissing([], null, parcours, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parcours);
      });

      it('should return initial array if no Parcours is added', () => {
        const parcoursCollection: IParcours[] = [{ id: 'ABC' }];
        expectedResult = service.addParcoursToCollectionIfMissing(parcoursCollection, undefined, null);
        expect(expectedResult).toEqual(parcoursCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
