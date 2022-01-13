import { IBloc } from 'app/entities/bloc/bloc.model';
import { IParcours } from 'app/entities/parcours/parcours.model';

export interface IEtape {
  id?: string;
  name?: string;
  label?: string;
  display?: boolean;
  blocs?: IBloc[] | null;
  parcours?: IParcours | null;
}

export class Etape implements IEtape {
  constructor(
    public id?: string,
    public name?: string,
    public label?: string,
    public display?: boolean,
    public blocs?: IBloc[] | null,
    public parcours?: IParcours | null
  ) {
    this.display = this.display ?? false;
  }
}

export function getEtapeIdentifier(etape: IEtape): string | undefined {
  return etape.id;
}
