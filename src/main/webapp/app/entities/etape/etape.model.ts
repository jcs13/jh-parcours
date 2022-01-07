import { IBloc } from 'app/entities/bloc/bloc.model';
import { IParcours } from 'app/entities/parcours/parcours.model';

export interface IEtape {
  id?: number;
  name?: string;
  blocs?: IBloc[] | null;
  parcours?: IParcours | null;
}

export class Etape implements IEtape {
  constructor(public id?: number, public name?: string, public blocs?: IBloc[] | null, public parcours?: IParcours | null) {}
}

export function getEtapeIdentifier(etape: IEtape): number | undefined {
  return etape.id;
}
