import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEtapeOrder } from '../etape-order.model';
import { EtapeOrderService } from '../service/etape-order.service';

@Component({
  templateUrl: './etape-order-delete-dialog.component.html',
})
export class EtapeOrderDeleteDialogComponent {
  etapeOrder?: IEtapeOrder;

  constructor(protected etapeOrderService: EtapeOrderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.etapeOrderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
