import { IOffre } from 'app/entities/offre/offre.model';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';

export interface IOffreParcoursComposition {
  id?: number;
  start?: boolean | null;
  offre?: IOffre | null;
  parcoursParent?: IParcoursDefinition | null;
  parcoursChild?: IParcoursDefinition | null;
}

export class OffreParcoursComposition implements IOffreParcoursComposition {
  constructor(
    public id?: number,
    public start?: boolean | null,
    public offre?: IOffre | null,
    public parcoursParent?: IParcoursDefinition | null,
    public parcoursChild?: IParcoursDefinition | null
  ) {
    this.start = this.start ?? false;
  }
}

export function getOffreParcoursCompositionIdentifier(offreParcoursComposition: IOffreParcoursComposition): number | undefined {
  return offreParcoursComposition.id;
}
