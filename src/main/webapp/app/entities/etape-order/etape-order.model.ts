import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';

export interface IEtapeOrder {
  id?: number;
  start?: boolean | null;
  parcoursDefinition?: IParcoursDefinition | null;
  current?: IEtapeDefinition | null;
  next?: IEtapeDefinition | null;
}

export class EtapeOrder implements IEtapeOrder {
  constructor(
    public id?: number,
    public start?: boolean | null,
    public parcoursDefinition?: IParcoursDefinition | null,
    public current?: IEtapeDefinition | null,
    public next?: IEtapeDefinition | null
  ) {
    this.start = this.start ?? false;
  }
}

export function getEtapeOrderIdentifier(etapeOrder: IEtapeOrder): number | undefined {
  return etapeOrder.id;
}
