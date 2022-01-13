import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEtapeOrder, EtapeOrder } from '../etape-order.model';
import { EtapeOrderService } from '../service/etape-order.service';

@Injectable({ providedIn: 'root' })
export class EtapeOrderRoutingResolveService implements Resolve<IEtapeOrder> {
  constructor(protected service: EtapeOrderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEtapeOrder> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((etapeOrder: HttpResponse<EtapeOrder>) => {
          if (etapeOrder.body) {
            return of(etapeOrder.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EtapeOrder());
  }
}
