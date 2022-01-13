import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBloc, Bloc } from '../bloc.model';

import { BlocService } from './bloc.service';

describe('Bloc Service', () => {
  let service: BlocService;
  let httpMock: HttpTestingController;
  let elemDefault: IBloc;
  let expectedResult: IBloc | IBloc[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BlocService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      name: 'AAAAAAA',
      label: 'AAAAAAA',
      elementName: 'AAAAAAA',
      elementPath: 'AAAAAAA',
      display: false,
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

    it('should create a Bloc', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Bloc()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Bloc', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          label: 'BBBBBB',
          elementName: 'BBBBBB',
          elementPath: 'BBBBBB',
          display: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Bloc', () => {
      const patchObject = Object.assign(
        {
          label: 'BBBBBB',
          elementName: 'BBBBBB',
          elementPath: 'BBBBBB',
        },
        new Bloc()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Bloc', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
          label: 'BBBBBB',
          elementName: 'BBBBBB',
          elementPath: 'BBBBBB',
          display: true,
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

    it('should delete a Bloc', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBlocToCollectionIfMissing', () => {
      it('should add a Bloc to an empty array', () => {
        const bloc: IBloc = { id: 'ABC' };
        expectedResult = service.addBlocToCollectionIfMissing([], bloc);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bloc);
      });

      it('should not add a Bloc to an array that contains it', () => {
        const bloc: IBloc = { id: 'ABC' };
        const blocCollection: IBloc[] = [
          {
            ...bloc,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addBlocToCollectionIfMissing(blocCollection, bloc);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Bloc to an array that doesn't contain it", () => {
        const bloc: IBloc = { id: 'ABC' };
        const blocCollection: IBloc[] = [{ id: 'CBA' }];
        expectedResult = service.addBlocToCollectionIfMissing(blocCollection, bloc);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bloc);
      });

      it('should add only unique Bloc to an array', () => {
        const blocArray: IBloc[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'f41b3eff-f28f-482b-94a7-feb211f3750a' }];
        const blocCollection: IBloc[] = [{ id: 'ABC' }];
        expectedResult = service.addBlocToCollectionIfMissing(blocCollection, ...blocArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bloc: IBloc = { id: 'ABC' };
        const bloc2: IBloc = { id: 'CBA' };
        expectedResult = service.addBlocToCollectionIfMissing([], bloc, bloc2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bloc);
        expect(expectedResult).toContain(bloc2);
      });

      it('should accept null and undefined values', () => {
        const bloc: IBloc = { id: 'ABC' };
        expectedResult = service.addBlocToCollectionIfMissing([], null, bloc, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bloc);
      });

      it('should return initial array if no Bloc is added', () => {
        const blocCollection: IBloc[] = [{ id: 'ABC' }];
        expectedResult = service.addBlocToCollectionIfMissing(blocCollection, undefined, null);
        expect(expectedResult).toEqual(blocCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
