import { IParcours } from 'app/entities/parcours/parcours.model';

export interface IOffre {
  id?: number;
  name?: string;
  parcours?: IParcours | null;
}

export class Offre implements IOffre {
  constructor(public id?: number, public name?: string, public parcours?: IParcours | null) {}
}

export function getOffreIdentifier(offre: IOffre): number | undefined {
  return offre.id;
}
