import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlocOrder } from '../bloc-order.model';
import { BlocOrderService } from '../service/bloc-order.service';

@Component({
  templateUrl: './bloc-order-delete-dialog.component.html',
})
export class BlocOrderDeleteDialogComponent {
  blocOrder?: IBlocOrder;

  constructor(protected blocOrderService: BlocOrderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.blocOrderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
