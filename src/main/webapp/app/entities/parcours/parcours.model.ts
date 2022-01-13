import { IEtape } from 'app/entities/etape/etape.model';

export interface IParcours {
  id?: string;
  name?: string;
  label?: string;
  offreId?: string;
  etapes?: IEtape[] | null;
}

export class Parcours implements IParcours {
  constructor(public id?: string, public name?: string, public label?: string, public offreId?: string, public etapes?: IEtape[] | null) {}
}

export function getParcoursIdentifier(parcours: IParcours): string | undefined {
  return parcours.id;
}
