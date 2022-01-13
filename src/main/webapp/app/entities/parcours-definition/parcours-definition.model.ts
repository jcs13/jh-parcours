import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';

export interface IParcoursDefinition {
  id?: string;
  name?: string;
  label?: string;
  etapeDefinitions?: IEtapeDefinition[] | null;
}

export class ParcoursDefinition implements IParcoursDefinition {
  constructor(public id?: string, public name?: string, public label?: string, public etapeDefinitions?: IEtapeDefinition[] | null) {}
}

export function getParcoursDefinitionIdentifier(parcoursDefinition: IParcoursDefinition): string | undefined {
  return parcoursDefinition.id;
}
