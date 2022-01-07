import { IEtape } from 'app/entities/etape/etape.model';
import { IOffre } from 'app/entities/offre/offre.model';

export interface IParcours {
  id?: number;
  name?: string;
  etapes?: IEtape[] | null;
  offres?: IOffre[] | null;
  parcours?: IParcours[] | null;
  parent?: IParcours | null;
}

export class Parcours implements IParcours {
  constructor(
    public id?: number,
    public name?: string,
    public etapes?: IEtape[] | null,
    public offres?: IOffre[] | null,
    public parcours?: IParcours[] | null,
    public parent?: IParcours | null
  ) {}
}

export function getParcoursIdentifier(parcours: IParcours): number | undefined {
  return parcours.id;
}
