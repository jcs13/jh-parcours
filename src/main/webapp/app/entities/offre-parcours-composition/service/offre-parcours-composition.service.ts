import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOffreParcoursComposition, getOffreParcoursCompositionIdentifier } from '../offre-parcours-composition.model';

export type EntityResponseType = HttpResponse<IOffreParcoursComposition>;
export type EntityArrayResponseType = HttpResponse<IOffreParcoursComposition[]>;

@Injectable({ providedIn: 'root' })
export class OffreParcoursCompositionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/offre-parcours-compositions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(offreParcoursComposition: IOffreParcoursComposition): Observable<EntityResponseType> {
    return this.http.post<IOffreParcoursComposition>(this.resourceUrl, offreParcoursComposition, { observe: 'response' });
  }

  update(offreParcoursComposition: IOffreParcoursComposition): Observable<EntityResponseType> {
    return this.http.put<IOffreParcoursComposition>(
      `${this.resourceUrl}/${getOffreParcoursCompositionIdentifier(offreParcoursComposition) as number}`,
      offreParcoursComposition,
      { observe: 'response' }
    );
  }

  partialUpdate(offreParcoursComposition: IOffreParcoursComposition): Observable<EntityResponseType> {
    return this.http.patch<IOffreParcoursComposition>(
      `${this.resourceUrl}/${getOffreParcoursCompositionIdentifier(offreParcoursComposition) as number}`,
      offreParcoursComposition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOffreParcoursComposition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOffreParcoursComposition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOffreParcoursCompositionToCollectionIfMissing(
    offreParcoursCompositionCollection: IOffreParcoursComposition[],
    ...offreParcoursCompositionsToCheck: (IOffreParcoursComposition | null | undefined)[]
  ): IOffreParcoursComposition[] {
    const offreParcoursCompositions: IOffreParcoursComposition[] = offreParcoursCompositionsToCheck.filter(isPresent);
    if (offreParcoursCompositions.length > 0) {
      const offreParcoursCompositionCollectionIdentifiers = offreParcoursCompositionCollection.map(
        offreParcoursCompositionItem => getOffreParcoursCompositionIdentifier(offreParcoursCompositionItem)!
      );
      const offreParcoursCompositionsToAdd = offreParcoursCompositions.filter(offreParcoursCompositionItem => {
        const offreParcoursCompositionIdentifier = getOffreParcoursCompositionIdentifier(offreParcoursCompositionItem);
        if (
          offreParcoursCompositionIdentifier == null ||
          offreParcoursCompositionCollectionIdentifiers.includes(offreParcoursCompositionIdentifier)
        ) {
          return false;
        }
        offreParcoursCompositionCollectionIdentifiers.push(offreParcoursCompositionIdentifier);
        return true;
      });
      return [...offreParcoursCompositionsToAdd, ...offreParcoursCompositionCollection];
    }
    return offreParcoursCompositionCollection;
  }
}
