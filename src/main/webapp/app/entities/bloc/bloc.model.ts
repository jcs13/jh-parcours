import { IEtape } from 'app/entities/etape/etape.model';

export interface IBloc {
  id?: string;
  name?: string;
  label?: string;
  elementName?: string;
  elementPath?: string;
  display?: boolean;
  etape?: IEtape | null;
}

export class Bloc implements IBloc {
  constructor(
    public id?: string,
    public name?: string,
    public label?: string,
    public elementName?: string,
    public elementPath?: string,
    public display?: boolean,
    public etape?: IEtape | null
  ) {
    this.display = this.display ?? false;
  }
}

export function getBlocIdentifier(bloc: IBloc): string | undefined {
  return bloc.id;
}
