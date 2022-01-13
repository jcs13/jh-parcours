import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBlocOrder } from '../bloc-order.model';

@Component({
  selector: 'jhi-bloc-order-detail',
  templateUrl: './bloc-order-detail.component.html',
})
export class BlocOrderDetailComponent implements OnInit {
  blocOrder: IBlocOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blocOrder }) => {
      this.blocOrder = blocOrder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
