import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBlocOrder, getBlocOrderIdentifier } from '../bloc-order.model';

export type EntityResponseType = HttpResponse<IBlocOrder>;
export type EntityArrayResponseType = HttpResponse<IBlocOrder[]>;

@Injectable({ providedIn: 'root' })
export class BlocOrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bloc-orders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(blocOrder: IBlocOrder): Observable<EntityResponseType> {
    return this.http.post<IBlocOrder>(this.resourceUrl, blocOrder, { observe: 'response' });
  }

  update(blocOrder: IBlocOrder): Observable<EntityResponseType> {
    return this.http.put<IBlocOrder>(`${this.resourceUrl}/${getBlocOrderIdentifier(blocOrder) as number}`, blocOrder, {
      observe: 'response',
    });
  }

  partialUpdate(blocOrder: IBlocOrder): Observable<EntityResponseType> {
    return this.http.patch<IBlocOrder>(`${this.resourceUrl}/${getBlocOrderIdentifier(blocOrder) as number}`, blocOrder, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBlocOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBlocOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBlocOrderToCollectionIfMissing(
    blocOrderCollection: IBlocOrder[],
    ...blocOrdersToCheck: (IBlocOrder | null | undefined)[]
  ): IBlocOrder[] {
    const blocOrders: IBlocOrder[] = blocOrdersToCheck.filter(isPresent);
    if (blocOrders.length > 0) {
      const blocOrderCollectionIdentifiers = blocOrderCollection.map(blocOrderItem => getBlocOrderIdentifier(blocOrderItem)!);
      const blocOrdersToAdd = blocOrders.filter(blocOrderItem => {
        const blocOrderIdentifier = getBlocOrderIdentifier(blocOrderItem);
        if (blocOrderIdentifier == null || blocOrderCollectionIdentifiers.includes(blocOrderIdentifier)) {
          return false;
        }
        blocOrderCollectionIdentifiers.push(blocOrderIdentifier);
        return true;
      });
      return [...blocOrdersToAdd, ...blocOrderCollection];
    }
    return blocOrderCollection;
  }
}
