import { IBlocDefinition } from 'app/entities/bloc-definition/bloc-definition.model';

export interface IElement {
  id?: string;
  name?: string;
  path?: string;
  blocDefinition?: IBlocDefinition | null;
}

export class Element implements IElement {
  constructor(public id?: string, public name?: string, public path?: string, public blocDefinition?: IBlocDefinition | null) {}
}

export function getElementIdentifier(element: IElement): string | undefined {
  return element.id;
}
