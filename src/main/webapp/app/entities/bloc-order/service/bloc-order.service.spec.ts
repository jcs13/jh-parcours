import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBlocOrder, BlocOrder } from '../bloc-order.model';

import { BlocOrderService } from './bloc-order.service';

describe('BlocOrder Service', () => {
  let service: BlocOrderService;
  let httpMock: HttpTestingController;
  let elemDefault: IBlocOrder;
  let expectedResult: IBlocOrder | IBlocOrder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BlocOrderService);
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

    it('should create a BlocOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new BlocOrder()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BlocOrder', () => {
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

    it('should partial update a BlocOrder', () => {
      const patchObject = Object.assign({}, new BlocOrder());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BlocOrder', () => {
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

    it('should delete a BlocOrder', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBlocOrderToCollectionIfMissing', () => {
      it('should add a BlocOrder to an empty array', () => {
        const blocOrder: IBlocOrder = { id: 123 };
        expectedResult = service.addBlocOrderToCollectionIfMissing([], blocOrder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blocOrder);
      });

      it('should not add a BlocOrder to an array that contains it', () => {
        const blocOrder: IBlocOrder = { id: 123 };
        const blocOrderCollection: IBlocOrder[] = [
          {
            ...blocOrder,
          },
          { id: 456 },
        ];
        expectedResult = service.addBlocOrderToCollectionIfMissing(blocOrderCollection, blocOrder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BlocOrder to an array that doesn't contain it", () => {
        const blocOrder: IBlocOrder = { id: 123 };
        const blocOrderCollection: IBlocOrder[] = [{ id: 456 }];
        expectedResult = service.addBlocOrderToCollectionIfMissing(blocOrderCollection, blocOrder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blocOrder);
      });

      it('should add only unique BlocOrder to an array', () => {
        const blocOrderArray: IBlocOrder[] = [{ id: 123 }, { id: 456 }, { id: 92782 }];
        const blocOrderCollection: IBlocOrder[] = [{ id: 123 }];
        expectedResult = service.addBlocOrderToCollectionIfMissing(blocOrderCollection, ...blocOrderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const blocOrder: IBlocOrder = { id: 123 };
        const blocOrder2: IBlocOrder = { id: 456 };
        expectedResult = service.addBlocOrderToCollectionIfMissing([], blocOrder, blocOrder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blocOrder);
        expect(expectedResult).toContain(blocOrder2);
      });

      it('should accept null and undefined values', () => {
        const blocOrder: IBlocOrder = { id: 123 };
        expectedResult = service.addBlocOrderToCollectionIfMissing([], null, blocOrder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blocOrder);
      });

      it('should return initial array if no BlocOrder is added', () => {
        const blocOrderCollection: IBlocOrder[] = [{ id: 123 }];
        expectedResult = service.addBlocOrderToCollectionIfMissing(blocOrderCollection, undefined, null);
        expect(expectedResult).toEqual(blocOrderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
