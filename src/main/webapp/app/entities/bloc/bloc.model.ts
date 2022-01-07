import { IEtape } from 'app/entities/etape/etape.model';

export interface IBloc {
  id?: number;
  name?: string;
  componentId?: string;
  etape?: IEtape | null;
}

export class Bloc implements IBloc {
  constructor(public id?: number, public name?: string, public componentId?: string, public etape?: IEtape | null) {}
}

export function getBlocIdentifier(bloc: IBloc): number | undefined {
  return bloc.id;
}
