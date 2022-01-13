import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';
import { IBlocDefinition } from 'app/entities/bloc-definition/bloc-definition.model';

export interface IBlocOrder {
  id?: number;
  start?: boolean | null;
  etapeDefinition?: IEtapeDefinition | null;
  current?: IBlocDefinition | null;
  next?: IBlocDefinition | null;
}

export class BlocOrder implements IBlocOrder {
  constructor(
    public id?: number,
    public start?: boolean | null,
    public etapeDefinition?: IEtapeDefinition | null,
    public current?: IBlocDefinition | null,
    public next?: IBlocDefinition | null
  ) {
    this.start = this.start ?? false;
  }
}

export function getBlocOrderIdentifier(blocOrder: IBlocOrder): number | undefined {
  return blocOrder.id;
}
