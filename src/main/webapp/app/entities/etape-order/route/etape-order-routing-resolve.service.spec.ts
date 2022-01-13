import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IEtapeOrder, EtapeOrder } from '../etape-order.model';
import { EtapeOrderService } from '../service/etape-order.service';

import { EtapeOrderRoutingResolveService } from './etape-order-routing-resolve.service';

describe('EtapeOrder routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EtapeOrderRoutingResolveService;
  let service: EtapeOrderService;
  let resultEtapeOrder: IEtapeOrder | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(EtapeOrderRoutingResolveService);
    service = TestBed.inject(EtapeOrderService);
    resultEtapeOrder = undefined;
  });

  describe('resolve', () => {
    it('should return IEtapeOrder returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEtapeOrder = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEtapeOrder).toEqual({ id: 123 });
    });

    it('should return new IEtapeOrder if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEtapeOrder = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEtapeOrder).toEqual(new EtapeOrder());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EtapeOrder })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEtapeOrder = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEtapeOrder).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
