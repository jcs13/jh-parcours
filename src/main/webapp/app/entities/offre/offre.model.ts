export interface IOffre {
  id?: string;
  name?: string;
  label?: string;
}

export class Offre implements IOffre {
  constructor(public id?: string, public name?: string, public label?: string) {}
}

export function getOffreIdentifier(offre: IOffre): string | undefined {
  return offre.id;
}
