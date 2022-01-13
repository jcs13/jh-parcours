import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOffreParcoursComposition, OffreParcoursComposition } from '../offre-parcours-composition.model';
import { OffreParcoursCompositionService } from '../service/offre-parcours-composition.service';

@Injectable({ providedIn: 'root' })
export class OffreParcoursCompositionRoutingResolveService implements Resolve<IOffreParcoursComposition> {
  constructor(protected service: OffreParcoursCompositionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOffreParcoursComposition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((offreParcoursComposition: HttpResponse<OffreParcoursComposition>) => {
          if (offreParcoursComposition.body) {
            return of(offreParcoursComposition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OffreParcoursComposition());
  }
}
