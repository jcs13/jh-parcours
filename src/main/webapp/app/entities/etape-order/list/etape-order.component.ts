import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEtapeOrder } from '../etape-order.model';
import { EtapeOrderService } from '../service/etape-order.service';
import { EtapeOrderDeleteDialogComponent } from '../delete/etape-order-delete-dialog.component';

@Component({
  selector: 'jhi-etape-order',
  templateUrl: './etape-order.component.html',
})
export class EtapeOrderComponent implements OnInit {
  etapeOrders?: IEtapeOrder[];
  isLoading = false;

  constructor(protected etapeOrderService: EtapeOrderService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.etapeOrderService.query().subscribe({
      next: (res: HttpResponse<IEtapeOrder[]>) => {
        this.isLoading = false;
        this.etapeOrders = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEtapeOrder): number {
    return item.id!;
  }

  delete(etapeOrder: IEtapeOrder): void {
    const modalRef = this.modalService.open(EtapeOrderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.etapeOrder = etapeOrder;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
