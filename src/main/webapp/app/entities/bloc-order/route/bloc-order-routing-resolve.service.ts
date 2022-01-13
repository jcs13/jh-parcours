import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBlocOrder, BlocOrder } from '../bloc-order.model';
import { BlocOrderService } from '../service/bloc-order.service';

@Injectable({ providedIn: 'root' })
export class BlocOrderRoutingResolveService implements Resolve<IBlocOrder> {
  constructor(protected service: BlocOrderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBlocOrder> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((blocOrder: HttpResponse<BlocOrder>) => {
          if (blocOrder.body) {
            return of(blocOrder.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BlocOrder());
  }
}
