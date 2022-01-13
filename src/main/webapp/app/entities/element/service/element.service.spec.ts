import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IElement, Element } from '../element.model';

import { ElementService } from './element.service';

describe('Element Service', () => {
  let service: ElementService;
  let httpMock: HttpTestingController;
  let elemDefault: IElement;
  let expectedResult: IElement | IElement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ElementService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      name: 'AAAAAAA',
      path: 'AAAAAAA',
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

    it('should create a Element', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Element()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Element', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          path: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Element', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Element()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Element', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          path: 'BBBBBB',
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

    it('should delete a Element', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addElementToCollectionIfMissing', () => {
      it('should add a Element to an empty array', () => {
        const element: IElement = { id: 'ABC' };
        expectedResult = service.addElementToCollectionIfMissing([], element);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(element);
      });

      it('should not add a Element to an array that contains it', () => {
        const element: IElement = { id: 'ABC' };
        const elementCollection: IElement[] = [
          {
            ...element,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addElementToCollectionIfMissing(elementCollection, element);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Element to an array that doesn't contain it", () => {
        const element: IElement = { id: 'ABC' };
        const elementCollection: IElement[] = [{ id: 'CBA' }];
        expectedResult = service.addElementToCollectionIfMissing(elementCollection, element);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(element);
      });

      it('should add only unique Element to an array', () => {
        const elementArray: IElement[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'af68a97f-b5bb-400d-bcba-af677fe6a4e6' }];
        const elementCollection: IElement[] = [{ id: 'ABC' }];
        expectedResult = service.addElementToCollectionIfMissing(elementCollection, ...elementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const element: IElement = { id: 'ABC' };
        const element2: IElement = { id: 'CBA' };
        expectedResult = service.addElementToCollectionIfMissing([], element, element2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(element);
        expect(expectedResult).toContain(element2);
      });

      it('should accept null and undefined values', () => {
        const element: IElement = { id: 'ABC' };
        expectedResult = service.addElementToCollectionIfMissing([], null, element, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(element);
      });

      it('should return initial array if no Element is added', () => {
        const elementCollection: IElement[] = [{ id: 'ABC' }];
        expectedResult = service.addElementToCollectionIfMissing(elementCollection, undefined, null);
        expect(expectedResult).toEqual(elementCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
