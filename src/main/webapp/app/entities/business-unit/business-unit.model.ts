export interface IBusinessUnit {
  id?: string;
  code?: string;
  name?: string;
  label?: string;
}

export class BusinessUnit implements IBusinessUnit {
  constructor(public id?: string, public code?: string, public name?: string, public label?: string) {}
}

export function getBusinessUnitIdentifier(businessUnit: IBusinessUnit): string | undefined {
  return businessUnit.id;
}
