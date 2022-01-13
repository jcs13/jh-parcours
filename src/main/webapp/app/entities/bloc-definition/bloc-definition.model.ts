import { IElement } from 'app/entities/element/element.model';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';

export interface IBlocDefinition {
  id?: string;
  name?: string;
  label?: string;
  element?: IElement | null;
  etapeDefinition?: IEtapeDefinition | null;
}

export class BlocDefinition implements IBlocDefinition {
  constructor(
    public id?: string,
    public name?: string,
    public label?: string,
    public element?: IElement | null,
    public etapeDefinition?: IEtapeDefinition | null
  ) {}
}

export function getBlocDefinitionIdentifier(blocDefinition: IBlocDefinition): string | undefined {
  return blocDefinition.id;
}
