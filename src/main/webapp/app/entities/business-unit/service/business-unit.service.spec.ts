import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBusinessUnit, BusinessUnit } from '../business-unit.model';

import { BusinessUnitService } from './business-unit.service';

describe('BusinessUnit Service', () => {
  let service: BusinessUnitService;
  let httpMock: HttpTestingController;
  let elemDefault: IBusinessUnit;
  let expectedResult: IBusinessUnit | IBusinessUnit[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BusinessUnitService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      code: 'AAAAAAA',
      name: 'AAAAAAA',
      label: 'AAAAAAA',
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

    it('should create a BusinessUnit', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new BusinessUnit()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BusinessUnit', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          code: 'BBBBBB',
          name: 'BBBBBB',
          label: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BusinessUnit', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          label: 'BBBBBB',
        },
        new BusinessUnit()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BusinessUnit', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          code: 'BBBBBB',
          name: 'BBBBBB',
          label: 'BBBBBB',
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

    it('should delete a BusinessUnit', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBusinessUnitToCollectionIfMissing', () => {
      it('should add a BusinessUnit to an empty array', () => {
        const businessUnit: IBusinessUnit = { id: 'ABC' };
        expectedResult = service.addBusinessUnitToCollectionIfMissing([], businessUnit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessUnit);
      });

      it('should not add a BusinessUnit to an array that contains it', () => {
        const businessUnit: IBusinessUnit = { id: 'ABC' };
        const businessUnitCollection: IBusinessUnit[] = [
          {
            ...businessUnit,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addBusinessUnitToCollectionIfMissing(businessUnitCollection, businessUnit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BusinessUnit to an array that doesn't contain it", () => {
        const businessUnit: IBusinessUnit = { id: 'ABC' };
        const businessUnitCollection: IBusinessUnit[] = [{ id: 'CBA' }];
        expectedResult = service.addBusinessUnitToCollectionIfMissing(businessUnitCollection, businessUnit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessUnit);
      });

      it('should add only unique BusinessUnit to an array', () => {
        const businessUnitArray: IBusinessUnit[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'b1ff4327-c81d-4ed6-bdeb-b7a9b03fa68f' }];
        const businessUnitCollection: IBusinessUnit[] = [{ id: 'ABC' }];
        expectedResult = service.addBusinessUnitToCollectionIfMissing(businessUnitCollection, ...businessUnitArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const businessUnit: IBusinessUnit = { id: 'ABC' };
        const businessUnit2: IBusinessUnit = { id: 'CBA' };
        expectedResult = service.addBusinessUnitToCollectionIfMissing([], businessUnit, businessUnit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessUnit);
        expect(expectedResult).toContain(businessUnit2);
      });

      it('should accept null and undefined values', () => {
        const businessUnit: IBusinessUnit = { id: 'ABC' };
        expectedResult = service.addBusinessUnitToCollectionIfMissing([], null, businessUnit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessUnit);
      });

      it('should return initial array if no BusinessUnit is added', () => {
        const businessUnitCollection: IBusinessUnit[] = [{ id: 'ABC' }];
        expectedResult = service.addBusinessUnitToCollectionIfMissing(businessUnitCollection, undefined, null);
        expect(expectedResult).toEqual(businessUnitCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
