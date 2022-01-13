import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEtapeOrder } from '../etape-order.model';

@Component({
  selector: 'jhi-etape-order-detail',
  templateUrl: './etape-order-detail.component.html',
})
export class EtapeOrderDetailComponent implements OnInit {
  etapeOrder: IEtapeOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etapeOrder }) => {
      this.etapeOrder = etapeOrder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
