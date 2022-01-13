import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEtapeOrder, EtapeOrder } from '../etape-order.model';

import { EtapeOrderService } from './etape-order.service';

describe('EtapeOrder Service', () => {
  let service: EtapeOrderService;
  let httpMock: HttpTestingController;
  let elemDefault: IEtapeOrder;
  let expectedResult: IEtapeOrder | IEtapeOrder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EtapeOrderService);
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

    it('should create a EtapeOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new EtapeOrder()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EtapeOrder', () => {
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

    it('should partial update a EtapeOrder', () => {
      const patchObject = Object.assign(
        {
          start: true,
        },
        new EtapeOrder()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EtapeOrder', () => {
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

    it('should delete a EtapeOrder', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEtapeOrderToCollectionIfMissing', () => {
      it('should add a EtapeOrder to an empty array', () => {
        const etapeOrder: IEtapeOrder = { id: 123 };
        expectedResult = service.addEtapeOrderToCollectionIfMissing([], etapeOrder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etapeOrder);
      });

      it('should not add a EtapeOrder to an array that contains it', () => {
        const etapeOrder: IEtapeOrder = { id: 123 };
        const etapeOrderCollection: IEtapeOrder[] = [
          {
            ...etapeOrder,
          },
          { id: 456 },
        ];
        expectedResult = service.addEtapeOrderToCollectionIfMissing(etapeOrderCollection, etapeOrder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EtapeOrder to an array that doesn't contain it", () => {
        const etapeOrder: IEtapeOrder = { id: 123 };
        const etapeOrderCollection: IEtapeOrder[] = [{ id: 456 }];
        expectedResult = service.addEtapeOrderToCollectionIfMissing(etapeOrderCollection, etapeOrder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etapeOrder);
      });

      it('should add only unique EtapeOrder to an array', () => {
        const etapeOrderArray: IEtapeOrder[] = [{ id: 123 }, { id: 456 }, { id: 60175 }];
        const etapeOrderCollection: IEtapeOrder[] = [{ id: 123 }];
        expectedResult = service.addEtapeOrderToCollectionIfMissing(etapeOrderCollection, ...etapeOrderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const etapeOrder: IEtapeOrder = { id: 123 };
        const etapeOrder2: IEtapeOrder = { id: 456 };
        expectedResult = service.addEtapeOrderToCollectionIfMissing([], etapeOrder, etapeOrder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etapeOrder);
        expect(expectedResult).toContain(etapeOrder2);
      });

      it('should accept null and undefined values', () => {
        const etapeOrder: IEtapeOrder = { id: 123 };
        expectedResult = service.addEtapeOrderToCollectionIfMissing([], null, etapeOrder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etapeOrder);
      });

      it('should return initial array if no EtapeOrder is added', () => {
        const etapeOrderCollection: IEtapeOrder[] = [{ id: 123 }];
        expectedResult = service.addEtapeOrderToCollectionIfMissing(etapeOrderCollection, undefined, null);
        expect(expectedResult).toEqual(etapeOrderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
