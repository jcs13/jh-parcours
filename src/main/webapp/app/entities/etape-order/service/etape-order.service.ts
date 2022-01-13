import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEtapeOrder, getEtapeOrderIdentifier } from '../etape-order.model';

export type EntityResponseType = HttpResponse<IEtapeOrder>;
export type EntityArrayResponseType = HttpResponse<IEtapeOrder[]>;

@Injectable({ providedIn: 'root' })
export class EtapeOrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/etape-orders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(etapeOrder: IEtapeOrder): Observable<EntityResponseType> {
    return this.http.post<IEtapeOrder>(this.resourceUrl, etapeOrder, { observe: 'response' });
  }

  update(etapeOrder: IEtapeOrder): Observable<EntityResponseType> {
    return this.http.put<IEtapeOrder>(`${this.resourceUrl}/${getEtapeOrderIdentifier(etapeOrder) as number}`, etapeOrder, {
      observe: 'response',
    });
  }

  partialUpdate(etapeOrder: IEtapeOrder): Observable<EntityResponseType> {
    return this.http.patch<IEtapeOrder>(`${this.resourceUrl}/${getEtapeOrderIdentifier(etapeOrder) as number}`, etapeOrder, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEtapeOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEtapeOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEtapeOrderToCollectionIfMissing(
    etapeOrderCollection: IEtapeOrder[],
    ...etapeOrdersToCheck: (IEtapeOrder | null | undefined)[]
  ): IEtapeOrder[] {
    const etapeOrders: IEtapeOrder[] = etapeOrdersToCheck.filter(isPresent);
    if (etapeOrders.length > 0) {
      const etapeOrderCollectionIdentifiers = etapeOrderCollection.map(etapeOrderItem => getEtapeOrderIdentifier(etapeOrderItem)!);
      const etapeOrdersToAdd = etapeOrders.filter(etapeOrderItem => {
        const etapeOrderIdentifier = getEtapeOrderIdentifier(etapeOrderItem);
        if (etapeOrderIdentifier == null || etapeOrderCollectionIdentifiers.includes(etapeOrderIdentifier)) {
          return false;
        }
        etapeOrderCollectionIdentifiers.push(etapeOrderIdentifier);
        return true;
      });
      return [...etapeOrdersToAdd, ...etapeOrderCollection];
    }
    return etapeOrderCollection;
  }
}
