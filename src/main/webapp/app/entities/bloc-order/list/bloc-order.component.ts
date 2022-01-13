import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlocOrder } from '../bloc-order.model';
import { BlocOrderService } from '../service/bloc-order.service';
import { BlocOrderDeleteDialogComponent } from '../delete/bloc-order-delete-dialog.component';

@Component({
  selector: 'jhi-bloc-order',
  templateUrl: './bloc-order.component.html',
})
export class BlocOrderComponent implements OnInit {
  blocOrders?: IBlocOrder[];
  isLoading = false;

  constructor(protected blocOrderService: BlocOrderService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.blocOrderService.query().subscribe({
      next: (res: HttpResponse<IBlocOrder[]>) => {
        this.isLoading = false;
        this.blocOrders = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBlocOrder): number {
    return item.id!;
  }

  delete(blocOrder: IBlocOrder): void {
    const modalRef = this.modalService.open(BlocOrderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.blocOrder = blocOrder;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
